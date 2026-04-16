import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DashboardKpi } from "./entities/dashboard-kpi.entity";
import { DashboardService } from "./dashboard.service";
import { DashboardController } from "./dashboard.controller";
import { TransactionsModule } from "../transactions/transactions.module";

@Module({
  imports: [TypeOrmModule.forFeature([DashboardKpi]), TransactionsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
