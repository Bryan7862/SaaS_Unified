import { IsEnum, IsNotEmpty } from 'class-validator';
import { ShiftType } from '../entities/staff-attendance.entity';

export class ClockInDto {
    @IsNotEmpty()
    @IsEnum(ShiftType)
    shiftType: ShiftType;
}
