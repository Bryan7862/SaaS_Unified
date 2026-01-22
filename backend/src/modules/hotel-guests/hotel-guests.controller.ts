import { Controller, Get, Post, Body, Param, UseGuards, Req, Query, Put } from '@nestjs/common';
import { HotelGuestsService } from './hotel-guests.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('hotel-guests')
@UseGuards(JwtAuthGuard)
export class HotelGuestsController {
    constructor(private readonly hotelGuestsService: HotelGuestsService) { }

    @Post()
    create(@Body() createGuestDto: CreateGuestDto, @Req() req: any) {
        const companyId = req.user.companyId;
        return this.hotelGuestsService.registerGuest(companyId, createGuestDto);
    }

    @Get()
    findAll(@Req() req: any, @Query('documentNumber') documentNumber?: string) {
        const companyId = req.user.companyId;
        if (documentNumber) {
            return this.hotelGuestsService.findGuestByDocumentNumber(companyId, documentNumber);
        }
        return this.hotelGuestsService.listAllGuestsByCompany(companyId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Req() req: any) {
        const companyId = req.user.companyId;
        return this.hotelGuestsService.findOne(companyId, id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateGuestDto: UpdateGuestDto, @Req() req: any) {
        const companyId = req.user.companyId;
        return this.hotelGuestsService.updateGuestContactInfo(companyId, id, updateGuestDto);
    }
}
