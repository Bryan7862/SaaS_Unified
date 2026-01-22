import { Controller, Get, Post, Body, Param, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { HotelBookingsService } from './hotel-bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('hotel-bookings')
@UseGuards(JwtAuthGuard)
export class HotelBookingsController {
    constructor(private readonly bookingsService: HotelBookingsService) { }

    private getCompanyId(req: any): string {
        const companyId = req.user.companyId || req.user.organizationId || req.user.defaultCompanyId;
        if (!companyId) {
            throw new BadRequestException('User does not have an active organization context.');
        }
        return companyId;
    }

    @Post()
    create(@Request() req, @Body() createBookingDto: CreateBookingDto) {
        return this.bookingsService.createBooking(createBookingDto, this.getCompanyId(req));
    }

    @Get()
    findAll(@Request() req) {
        return this.bookingsService.listBookings(this.getCompanyId(req));
    }

    @Post(':id/check-in')
    checkIn(@Request() req, @Param('id') id: string) {
        return this.bookingsService.processCheckIn(id, this.getCompanyId(req));
    }

    @Post(':id/check-out')
    checkOut(@Request() req, @Param('id') id: string) {
        return this.bookingsService.processCheckOut(id, this.getCompanyId(req));
    }
}
