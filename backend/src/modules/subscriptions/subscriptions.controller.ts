import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Headers,
} from "@nestjs/common";
import { SubscriptionsService } from "./subscriptions.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PlanCode } from "./enums/plan-code.enum";

@Controller("subscriptions")
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get("current")
  async getCurrentSubscription(@Headers("x-company-id") companyId: string) {
    return this.subscriptionsService.getCurrentSubscription(companyId);
  }

  @Post("change-plan")
  async changePlan(
    @Headers("x-company-id") companyId: string,
    @Body("planCode") planCode: PlanCode,
  ) {
    return this.subscriptionsService.changePlan(companyId, planCode);
  }
}
