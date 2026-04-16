import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HotelAttendanceService } from "./hotel-attendance.service";
import { HotelAttendanceController } from "./hotel-attendance.controller";
import { StaffAttendance } from "./entities/staff-attendance.entity";

@Module({
  imports: [TypeOrmModule.forFeature([StaffAttendance])],
  controllers: [HotelAttendanceController],
  providers: [HotelAttendanceService],
  exports: [HotelAttendanceService],
})
export class HotelAttendanceModule {}
