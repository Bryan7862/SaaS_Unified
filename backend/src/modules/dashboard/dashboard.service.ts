import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DashboardKpi } from "./entities/dashboard-kpi.entity";
import { CreateKpiDto } from "./dto/create-kpi.dto";

import { TransactionsService } from "../transactions/transactions.service";

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(DashboardKpi)
    private readonly kpiRepository: Repository<DashboardKpi>,
    private readonly transactionsService: TransactionsService,
  ) {}

  /**
   * Get all KPIs for a user for the current month/year
   */
  async getKpis(
    userId: string,
    month?: number,
    year?: number,
  ): Promise<DashboardKpi[]> {
    const now = new Date();
    const targetMonth = month ?? now.getMonth() + 1; // 1-12
    const targetYear = year ?? now.getFullYear();

    return this.kpiRepository.find({
      where: {
        userId,
        month: targetMonth,
        year: targetYear,
      },
    });
  }

  /**
   * Create or update a KPI for a user
   */
  async upsertKpi(
    userId: string,
    dto: CreateKpiDto,
    user?: any,
  ): Promise<DashboardKpi> {
    const now = new Date();
    const month = dto.month ?? now.getMonth() + 1;
    const year = dto.year ?? now.getFullYear();

    // Check if KPI exists
    let kpi = await this.kpiRepository.findOne({
      where: {
        userId,
        // organizationId: user?.defaultCompanyId, // Removed to avoid conflict with Unique(user, kpi, month, year)
        kpiType: dto.kpiType,
        month,
        year,
      },
    });

    if (kpi) {
      // Update existing
      kpi.value = dto.value;
      return this.kpiRepository.save(kpi);
    } else {
      // Create new
      kpi = this.kpiRepository.create({
        userId,
        organizationId: user?.defaultCompanyId, // Capture Org ID if available
        kpiType: dto.kpiType,
        value: dto.value,
        month,
        year,
      });
      return this.kpiRepository.save(kpi);
    }
  }

  /**
   * Get KPIs as a simple object map for frontend consumption
   */
  async getKpisAsMap(
    userId: string,
    user?: any,
  ): Promise<Record<string, number>> {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const organizationId = user?.defaultCompanyId;

    // 1. Get Manual KPIs (Clientes, Inventario, Facturas)
    // Order by: If org exists, search by org. Else by user.
    const whereCondition: any = {
      month,
      year,
    };

    if (organizationId) {
      whereCondition.organizationId = organizationId;
    } else {
      whereCondition.userId = userId;
    }

    const manualKpis = await this.kpiRepository.find({ where: whereCondition });

    // 2. Get Real Financial KPIs (Ingresos, Gastos)
    const financialStats = await this.transactionsService.getFinancialSummary(
      organizationId,
      userId,
      month,
      year,
    );

    const result: Record<string, number> = {
      clientes: 0,
      facturas: 0,
      inventario: 0,
      ingresos: financialStats.ingresos,
      gastos: financialStats.gastos,
      balance: financialStats.ingresos - financialStats.gastos,
    };

    for (const kpi of manualKpis) {
      result[kpi.kpiType] = Number(kpi.value);
    }

    return result;
  }
}
