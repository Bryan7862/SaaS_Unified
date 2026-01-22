import { Controller, Post, Get, Body, Query, UseGuards, Req } from '@nestjs/common';
import { HotelAttendanceService } from './hotel-attendance.service';
import { ClockInDto } from './dto/clock-in.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('hotel-attendance')
@UseGuards(JwtAuthGuard)
export class HotelAttendanceController {
    constructor(private readonly attendanceService: HotelAttendanceService) { }

    @Post('clock-in')
    clockIn(@Body() dto: ClockInDto, @Req() req: any) {
        const userId = req.user.id;
        const companyId = req.user.companyId;
        return this.attendanceService.clockIn(userId, companyId, dto.shiftType);
    }

    @Post('clock-out')
    clockOut(@Req() req: any) {
        const userId = req.user.id;
        const companyId = req.user.companyId;
        return this.attendanceService.clockOut(userId, companyId);
    }

    @Get('daily')
    getDailyAttendance(@Query('date') date: string, @Req() req: any) {
        const companyId = req.user.companyId;
        // Default to today if no date provided
        const targetDate = date || new Date().toISOString().split('T')[0];
        return this.attendanceService.getDailyAttendance(companyId, targetDate);
    }

    @Get('history')
    getUserHistory(@Req() req: any) {
        const userId = req.user.id;
        const companyId = req.user.companyId;
        return this.attendanceService.getUserHistory(userId, companyId);
    }
}
