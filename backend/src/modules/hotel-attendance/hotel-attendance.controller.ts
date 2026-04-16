import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Req,
} from "@nestjs/common";
import { HotelAttendanceService } from "./hotel-attendance.service";
import { ClockInDto } from "./dto/clock-in.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ActiveCompanyId } from "../../common/decorators/active-company-id.decorator";

@Controller("hotel-attendance")
@UseGuards(JwtAuthGuard)
export class HotelAttendanceController {
  constructor(private readonly attendanceService: HotelAttendanceService) {}

  @Post("clock-in")
  clockIn(
    @Body() dto: ClockInDto,
    @Req() req: any,
    @ActiveCompanyId() companyId: string,
  ) {
    const userId = req.user.id;
    return this.attendanceService.clockIn(userId, companyId, dto.shiftType);
  }

  @Post("clock-out")
  clockOut(@Req() req: any, @ActiveCompanyId() companyId: string) {
    const userId = req.user.id;
    return this.attendanceService.clockOut(userId, companyId);
  }

  @Get("daily")
  getDailyAttendance(
    @Query("date") date: string,
    @ActiveCompanyId() companyId: string,
  ) {
    // Default to today if no date provided
    const targetDate = date || new Date().toISOString().split("T")[0];
    return this.attendanceService.getDailyAttendance(companyId, targetDate);
  }

  @Get("history")
  getUserHistory(@Req() req: any, @ActiveCompanyId() companyId: string) {
    const userId = req.user.id;
    return this.attendanceService.getUserHistory(userId, companyId);
  }
}
