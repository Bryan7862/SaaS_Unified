import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { HotelRoomsService } from './hotel-rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { CreateFloorDto } from './dto/create-floor.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Assuming this exists or standard path

@Controller('hotel-rooms')
@UseGuards(JwtAuthGuard)
export class HotelRoomsController {
    constructor(private readonly hotelRoomsService: HotelRoomsService) { }

    @Post('floors')
    async createFloor(@Request() req, @Body() createFloorDto: CreateFloorDto) {
        const companyId = req.user.companyId || req.user.organizationId || req.user.defaultCompanyId;
        if (!companyId) {
            throw new BadRequestException('User does not have an active organization context.');
        }
        return this.hotelRoomsService.createFloorForOrganization(companyId, createFloorDto);
    }

    @Get('floors')
    async listFloors(@Request() req) {
        const companyId = req.user.companyId || req.user.organizationId || req.user.defaultCompanyId;
        if (!companyId) {
            throw new BadRequestException('User does not have an active organization context.');
        }
        return this.hotelRoomsService.listAllFloorsByCompany(companyId);
    }

    @Get('categories')
    async listCategories(@Request() req) {
        const companyId = req.user.companyId || req.user.organizationId || req.user.defaultCompanyId;
        if (!companyId) {
            throw new BadRequestException('User does not have an active organization context.');
        }
        return this.hotelRoomsService.listAllCategoriesByCompany(companyId);
    }

    @Post('rooms')
    async createRoom(@Request() req, @Body() createRoomDto: CreateRoomDto) {
        const companyId = req.user.companyId || req.user.organizationId || req.user.defaultCompanyId;
        if (!companyId) {
            throw new BadRequestException('User does not have an active organization context.');
        }
        return this.hotelRoomsService.createNewRoomForOrganization(companyId, createRoomDto);
    }

    @Get('rooms')
    async listRooms(@Request() req) {
        const companyId = req.user.companyId || req.user.organizationId || req.user.defaultCompanyId;
        if (!companyId) {
            throw new BadRequestException('User does not have an active organization context.');
        }
        return this.hotelRoomsService.listAllRoomsByCompany(companyId);
    }

    @Get('rooms/:id')
    async getRoom(@Request() req, @Param('id') id: string) {
        const companyId = req.user.companyId || req.user.organizationId || req.user.defaultCompanyId;
        if (!companyId) {
            throw new BadRequestException('User does not have an active organization context.');
        }
        return this.hotelRoomsService.getRoomDetails(companyId, id);
    }
}
