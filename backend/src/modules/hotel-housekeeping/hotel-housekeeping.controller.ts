import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { HousekeepingService } from './hotel-housekeeping.service';
import { RegisterConsumptionDto } from './dto/register-consumption.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('hotel-housekeeping')
@UseGuards(JwtAuthGuard)
export class HousekeepingController {
    constructor(private readonly housekeepingService: HousekeepingService) { }

    @Get('cleaning-tasks')
    getPendingTasks(@Req() req: any) {
        const companyId = req.user.companyId;
        return this.housekeepingService.getPendingCleaningRoomsByCompany(companyId);
    }

    @Patch('rooms/:id/clean')
    markAsClean(@Param('id') id: string, @Req() req: any) {
        const companyId = req.user.companyId;
        return this.housekeepingService.markRoomAsClean(companyId, id);
    }

    @Post('consumption')
    registerConsumption(@Body() dto: RegisterConsumptionDto, @Req() req: any) {
        const companyId = req.user.companyId;
        return this.housekeepingService.registerMinibarConsumption(companyId, dto);
    }
}
