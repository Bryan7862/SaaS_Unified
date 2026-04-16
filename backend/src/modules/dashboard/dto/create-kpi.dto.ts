import { IsNumber, IsOptional, Min, Max, IsEnum } from "class-validator";
import { Type } from "class-transformer";

export class CreateKpiDto {
  @IsEnum(["clientes", "facturas", "inventario"])
  kpiType: string; // 'clientes' | 'facturas' | 'inventario'

  @Type(() => Number)
  @IsNumber()
  value: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(12)
  month?: number;

  @IsOptional()
  @IsNumber()
  year?: number;
}
