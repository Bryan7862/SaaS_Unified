import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SubscriptionsService } from "./subscriptions.service";
import { SubscriptionsController } from "./subscriptions.controller";
import { Subscription } from "./entities/subscription.entity";
import { PlansModule } from "../plans/plans.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription]),
    PlansModule, // Import PlansModule to use PlansService
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  exports: [SubscriptionsService], // Exported for OrganizationsModule
})
export class SubscriptionsModule {}
