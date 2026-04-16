import {
  Controller,
  Post,
  Body,
  Headers,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { CulqiService } from "../providers/culqi.service";
import { TransactionsService } from "../../transactions/transactions.service";
import { SubscriptionsService } from "../../subscriptions/subscriptions.service";
import { PlanCode } from "../../plans/enums/plan-code.enum";

@Controller("webhooks/culqi")
export class CulqiWebhookController {
  private readonly logger = new Logger(CulqiWebhookController.name);

  constructor(
    private readonly culqiService: CulqiService,
    private readonly transactionsService: TransactionsService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  @Post()
  async handleWebhook(
    @Body() payload: any,
    @Headers("culqi-signature") signature: string,
  ) {
    // payload type depends on event. For 'charge.creation.succeeded':
    // payload = { object: 'event', type: 'charge.creation.succeeded', data: { ...charge_object... } }

    // Note: Culqi V2 payloads usually contain the event type and the data object.
    this.logger.log(`Received Webhook: ${payload?.type}`);

    if (
      payload?.type !== "charge.creation.succeeded" &&
      payload?.type !== "charge.creation.failed"
    ) {
      // We ignore other events for now (e.g. token.created, refunds)
      return { received: true };
    }

    const chargeId = payload.data?.id;
    if (!chargeId) {
      throw new BadRequestException("Invalid Payload: Missing Charge ID");
    }

    // --- 0. Sandbox Mode Log ---
    // Helpful to debug if we are receiving Real or Test webhooks
    const isSandbox = chargeId.startsWith("chr_test");
    if (isSandbox) this.logger.log("Processing SANDBOX Charge");

    // --- 1. Idempotency Check ---
    const existingTx = await this.transactionsService.findByReference(chargeId);
    if (existingTx) {
      this.logger.log(
        `Idempotency Check: Charge ${chargeId} already processed.`,
      );
      return { received: true, status: "already_processed" };
    }

    // --- 2. Security Verification (Zero Trust) ---
    // Do NOT trust the payload data for business logic. Fetch truth from API.
    const charge = await this.culqiService.getCharge(chargeId);

    // A. Handle Failures
    if (
      payload.type === "charge.creation.failed" ||
      charge.outcome.type !== "venta_exitosa"
    ) {
      this.logger.warn(
        `Charge ${chargeId} FAILED. Outcome: ${charge.outcome.type}`,
      );

      // Extract Metadata or User (might be partial context)
      const { organizationId } = charge.metadata || {};

      if (organizationId) {
        await this.transactionsService.createPaymentLog({
          organizationId,
          amount: charge.amount / 100,
          currency: charge.currency_code,
          email: charge.email,
          description: `FAILED Payment - ${chargeId}`,
          referenceCode: chargeId,
          provider: "culqi",
          status: "FAILED",
        });
        await this.subscriptionsService.handleFailedPayment(organizationId);
      }
      return { status: "processed_failure" };
    }

    // Extract Valid Success Metadata
    const { organizationId, planCode } = charge.metadata || {};
    const email = charge.email;
    const amount = charge.amount / 100; // Convert cents to units

    // B. Price Verification (Security Check 3)
    let expectedAmount = 0;
    if (planCode === PlanCode.BASIC) expectedAmount = 50.0;
    else if (planCode === PlanCode.PRO) expectedAmount = 100.0;
    else if (planCode === PlanCode.MAX) expectedAmount = 200.0;

    // Allow small margin? (e.g. 50 vs 50.00). Strict for now.
    if (expectedAmount > 0 && amount < expectedAmount) {
      this.logger.error(
        `Price Manipulation Attempt! Paid ${amount} for ${planCode} (Expected ${expectedAmount})`,
      );
      await this.transactionsService.createPaymentLog({
        organizationId: organizationId || "UNKNOWN",
        amount,
        currency: charge.currency_code,
        email,
        description: `SCAM ATTEMPT ${planCode} - ${chargeId}`,
        referenceCode: chargeId,
        provider: "culqi",
        status: "FRAUD_ATTEMPT",
      });
      return { status: "blocked_fraud" };
    }

    if (!organizationId || !planCode) {
      this.logger.error(`Missing Metadata in Charge ${chargeId}`);
      // Capture payment but cannot activate subscription automatically implies Manual Review.
      await this.transactionsService.createPaymentLog({
        organizationId: organizationId || "UNKNOWN",
        amount,
        currency: charge.currency_code,
        email,
        description: `Unlinked Payment - ${chargeId}`,
        referenceCode: chargeId,
        provider: "culqi",
        status: "COMPLETED_NO_META",
      });
      return { status: "logged_missing_meta" };
    }

    // --- 3. Business Logic ---

    // A. Activate Subscription
    await this.subscriptionsService.activateSubscription(
      organizationId,
      planCode as PlanCode,
      charge.source?.id || "unknown_source", // Customer ID if available or Source
      chargeId, // Subscription ID mapping or Charge ID
      null, // Ends At calculated by service or null
    );

    // B. Log Transaction
    await this.transactionsService.createPaymentLog({
      organizationId,
      amount,
      currency: charge.currency_code,
      email,
      description: `Suscripción ${planCode} - ${chargeId}`,
      referenceCode: chargeId,
      provider: "culqi",
      status: "COMPLETED",
    });

    this.logger.log(`Subscription Activated for Org ${organizationId}`);

    return { success: true };
  }
}
