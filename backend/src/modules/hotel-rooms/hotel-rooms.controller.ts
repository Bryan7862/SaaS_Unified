import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { HotelRoomsService } from './hotel-rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { CreateFloorDto } from './dto/create-floor.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Assuming this exists or standard path
import { ActiveCompanyId } from '../../common/decorators/active-company-id.decorator';

@Controller('hotel-rooms')
@UseGuards(JwtAuthGuard)
export class HotelRoomsController {
    constructor(private readonly hotelRoomsService: HotelRoomsService) { }

    @Get('floors/archived')
    async listArchivedFloors(@ActiveCompanyId() companyId: string) {
        return this.hotelRoomsService.listArchivedFloors(companyId);
    }

    @Get('rooms/archived')
    async listArchivedRooms(@ActiveCompanyId() companyId: string) {
        return this.hotelRoomsService.listArchivedRooms(companyId);
    }

    @Post('floors')
    async createFloor(@ActiveCompanyId() companyId: string, @Body() createFloorDto: CreateFloorDto) {
        return this.hotelRoomsService.createFloorForOrganization(companyId, createFloorDto);
    }

    @Get('floors')
    async listFloors(@ActiveCompanyId() companyId: string) {
        return this.hotelRoomsService.listAllFloorsByCompany(companyId);
    }

    @Delete('floors/:id')
    async deleteFloor(@ActiveCompanyId() companyId: string, @Param('id') id: string) {
        return this.hotelRoomsService.deleteFloor(companyId, id);
    }

    @Get('categories')
    async listCategories(@ActiveCompanyId() companyId: string) {
        return this.hotelRoomsService.listAllCategoriesByCompany(companyId);
    }

    @Post('rooms')
    async createRoom(@ActiveCompanyId() companyId: string, @Body() createRoomDto: CreateRoomDto) {
        return this.hotelRoomsService.createNewRoomForOrganization(companyId, createRoomDto);
    }

    @Get('rooms')
    async listRooms(@ActiveCompanyId() companyId: string) {
        return this.hotelRoomsService.listAllRoomsByCompany(companyId);
    }

    @Get('rooms/:id')
    async getRoom(@ActiveCompanyId() companyId: string, @Param('id') id: string) {
        return this.hotelRoomsService.getRoomDetails(companyId, id);
    }

    @Delete(':id')
    async deleteRoom(@ActiveCompanyId() companyId: string, @Param('id') id: string) {
        return this.hotelRoomsService.deleteRoom(companyId, id);
    }

    // --- SOFT DELETE ENDPOINTS ---

    @Patch('floors/:id/archive')
    async archiveFloor(@Request() req, @ActiveCompanyId() companyId: string, @Param('id') id: string) {
        const userId = req.user.id || req.user.userId;
        return this.hotelRoomsService.archiveFloor(companyId, id, userId);
    }

    @Patch('floors/:id/restore')
    async restoreFloor(@Request() req, @ActiveCompanyId() companyId: string, @Param('id') id: string) {
        const userId = req.user.id || req.user.userId;
        return this.hotelRoomsService.restoreFloor(companyId, id, userId);
    }

    @Patch('rooms/:id/archive')
    async archiveRoom(@Request() req, @ActiveCompanyId() companyId: string, @Param('id') id: string) {
        const userId = req.user.id || req.user.userId;
        return this.hotelRoomsService.archiveRoom(companyId, id, userId);
    }

    @Patch('rooms/:id/restore')
    async restoreRoom(@Request() req, @ActiveCompanyId() companyId: string, @Param('id') id: string) {
        const userId = req.user.id || req.user.userId;
        return this.hotelRoomsService.restoreRoom(companyId, id, userId);
    }

}

// ... existing getRoom below ...
