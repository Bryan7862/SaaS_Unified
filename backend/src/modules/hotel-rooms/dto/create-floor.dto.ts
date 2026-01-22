import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFloorDto {
    @IsNumber()
    number: number;

    @IsString()
    @IsOptional()
    description?: string;
}
