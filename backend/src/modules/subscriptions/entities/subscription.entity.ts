import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { Plan } from "../../plans/entities/plan.entity";
import { PlanCode } from "../../plans/enums/plan-code.enum";
import { SubscriptionStatus } from "../enums/subscription-status.enum";
import { Company } from "../../organizations/entities/company.entity";

@Entity("subscriptions")
export class Subscription {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "organization_id", type: "uuid", unique: true })
  organizationId: string;

  @OneToOne(() => Company)
  @JoinColumn({ name: "organization_id" })
  organization: Company;

  @Column({
    name: "plan_code",
    type: "enum",
    enum: PlanCode,
    default: PlanCode.FREE,
  })
  planCode: PlanCode;

  @ManyToOne(() => Plan, { nullable: true }) // Unidirectional
  @JoinColumn({ name: "plan_id" })
  plan: Plan;

  @Column({ name: "plan_id", type: "uuid", nullable: true })
  planId: string;

  @Column({
    type: "enum",
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE, // Default to ACTIVE for FREE plan
  })
  status: SubscriptionStatus;

  @Column({
    name: "started_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  startedAt: Date;

  @Column({ name: "ends_at", type: "timestamp", nullable: true })
  endsAt: Date | null;

  @Column({ name: "provider_customer_id", type: "varchar", nullable: true })
  providerCustomerId: string | null;

  @Column({ name: "provider_subscription_id", type: "varchar", nullable: true })
  providerSubscriptionId: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
