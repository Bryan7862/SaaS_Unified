import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not, IsNull } from 'typeorm';
import { HotelRoom, RoomStatus } from './entities/hotel-room.entity';
import { HotelFloor } from './entities/hotel-floor.entity';
import { RoomCategory } from './entities/room-category.entity';
import { HotelBooking, BookingStatus } from '../hotel-bookings/entities/hotel-booking.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { CreateFloorDto } from './dto/create-floor.dto';

import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';

@Injectable()
export class HotelRoomsService {
    constructor(
        @InjectRepository(HotelRoom)
        private readonly roomRepository: Repository<HotelRoom>,
        @InjectRepository(HotelFloor)
        private readonly floorRepository: Repository<HotelFloor>,
        @InjectRepository(RoomCategory)
        private readonly categoryRepository: Repository<RoomCategory>,
        @InjectRepository(HotelBooking)
        private readonly bookingRepository: Repository<HotelBooking>,
        private readonly notificationsService: NotificationsService,
    ) { }

    // --- FLOORS ---

    async createFloorForOrganization(companyId: string, dto: CreateFloorDto): Promise<HotelFloor> {
        // Validation: Uniqueness within Company
        const existingFloor = await this.floorRepository.findOne({
            where: {
                number: dto.number,
                companyId: companyId,
            }
        });

        if (existingFloor) {
            throw new ConflictException('El número de piso ya está registrado');
        }

        const floor = this.floorRepository.create({
            ...dto,
            companyId,
        });
        return this.floorRepository.save(floor);
    }

    async listAllFloorsByCompany(companyId: string): Promise<HotelFloor[]> {
        return this.floorRepository.find({
            where: { companyId },
            relations: ['rooms'],
            order: { number: 'ASC' },
        });
    }

    async deleteFloor(companyId: string, floorId: string): Promise<void> {
        const floor = await this.floorRepository.findOne({
            where: { id: floorId, companyId },
            relations: ['rooms'],
        });

        if (!floor) {
            throw new NotFoundException('Floor not found');
        }

        if (floor.rooms && floor.rooms.length > 0) {
            throw new BadRequestException('No se puede eliminar un piso que tiene habitaciones asignadas.');
        }

        await this.floorRepository.delete(floorId);
    }

    // --- ROOM CATEGORIES ---

    async listAllCategoriesByCompany(companyId: string): Promise<RoomCategory[]> {
        return this.categoryRepository.find({
            where: { companyId },
            order: { name: 'ASC' },
        });
    }

    // --- ROOMS ---

    async deleteRoom(companyId: string, roomId: string): Promise<void> {
        // 1. Verify existence and ownership
        const room = await this.roomRepository.findOne({
            where: { id: roomId, companyId },
        });

        if (!room) {
            throw new NotFoundException('Room not found');
        }

        // 2. Critical Validation: Check for Active/Future Bookings
        const activeBookingsCount = await this.bookingRepository.count({
            where: {
                room: { id: roomId },
                companyId: companyId,
                status: Not(In([BookingStatus.CHECKED_OUT, BookingStatus.CANCELLED])),
            },
        });

        if (activeBookingsCount > 0) {
            throw new ConflictException('No se puede eliminar una habitación con reservas activas o futuras.');
        }

        // 3. Delete
        await this.roomRepository.delete(roomId);
    }

    async createNewRoomForOrganization(companyId: string, dto: CreateRoomDto): Promise<HotelRoom> {
        // ... (Existing implementation)
        // 1. Validation: Uniqueness within Company
        const existingRoom = await this.roomRepository.findOne({
            where: {
                number: dto.number,
                companyId: companyId,
            },
        });

        if (existingRoom) {
            throw new ConflictException(`Room number ${dto.number} already exists in this organization.`);
        }

        // 2. Validation: Integrity of Floor
        const floor = await this.floorRepository.findOne({
            where: {
                id: dto.floorId,
                companyId: companyId,
            },
        });

        if (!floor) {
            throw new BadRequestException('Invalid Floor ID. The floor must belong to your organization.');
        }

        // 3. Validation: Category
        const category = await this.categoryRepository.findOne({
            where: {
                id: dto.categoryId,
                companyId: companyId,
            },
        });

        if (!category) {
            throw new BadRequestException('Invalid Category ID. The category must belong to your organization.');
        }

        // 4. Creation
        const room = this.roomRepository.create({
            number: dto.number,
            floor: floor,
            category: category,
            status: dto.status || 'AVAILABLE',
            companyId: companyId,
        });

        return this.roomRepository.save(room);
    }

    // ... (Rest of methods)


    async listAllRoomsByCompany(companyId: string): Promise<HotelRoom[]> {
        return this.roomRepository.find({
            where: { companyId },
            relations: ['floor', 'category'],
            order: { number: 'ASC' },
        });
    }

    async getRoomDetails(companyId: string, roomId: string): Promise<HotelRoom> {
        const room = await this.roomRepository.findOne({
            where: { id: roomId, companyId },
            relations: ['floor', 'category'],
        });

        if (!room) {
            throw new NotFoundException('Room not found or access denied.');
        }

        return room;
    }
    // --- SOFT DELETE: FLOORS ---

    // --- SOFT DELETE: FLOORS ---

    async archiveFloor(companyId: string, floorId: string, userId: string): Promise<void> {
        const floor = await this.floorRepository.findOne({
            where: { id: floorId, companyId },
            relations: ['rooms'],
        });

        if (!floor) {
            throw new NotFoundException('Floor not found');
        }

        // Validation: Verify if any room is occupied
        const hasOccupiedRooms = floor.rooms.some(room => room.status === RoomStatus.OCCUPIED);
        if (hasOccupiedRooms) {
            throw new ConflictException('No se puede archivar el piso porque tiene habitaciones ocupadas.');
        }

        await this.floorRepository.softDelete(floorId);

        // Notification
        await this.notificationsService.notifyUser(userId, {
            title: 'Piso Archivado',
            message: `El Piso ${floor.number} y sus configuraciones han sido archivados`,
            type: NotificationType.WARNING,
            orgId: companyId
        });
    }

    async restoreFloor(companyId: string, floorId: string, userId: string): Promise<void> {
        // We use withDeleted: true to find it first
        const floor = await this.floorRepository.findOne({
            where: { id: floorId, companyId },
            withDeleted: true
        });

        if (!floor) {
            throw new NotFoundException('Floor not found (or not archived)');
        }

        await this.floorRepository.restore(floorId);

        // Notification
        await this.notificationsService.notifyUser(userId, {
            title: 'Piso Restaurado',
            message: `El Piso ${floor.number} ha sido restaurado con éxito`,
            type: NotificationType.INFO,
            orgId: companyId
        });
    }

    // --- SOFT DELETE: ROOMS ---

    async archiveRoom(companyId: string, roomId: string, userId: string): Promise<void> {
        const room = await this.roomRepository.findOne({
            where: { id: roomId, companyId },
        });

        if (!room) {
            throw new NotFoundException('Room not found');
        }

        // Validation: Check if Room is OCCUPIED
        if (room.status === RoomStatus.OCCUPIED) {
            throw new ConflictException('No se puede archivar una habitación que está OCUPADA.');
        }

        await this.roomRepository.softDelete(roomId);

        // Notification
        await this.notificationsService.notifyUser(userId, {
            title: 'Habitación Archivada',
            message: `La habitación ${room.number} ha sido enviada a la papelera`,
            type: NotificationType.WARNING,
            orgId: companyId
        });
    }

    async restoreRoom(companyId: string, roomId: string, userId: string): Promise<void> {
        const room = await this.roomRepository.findOne({
            where: { id: roomId, companyId },
            withDeleted: true
        });

        if (!room) {
            throw new NotFoundException('Room not found (or not archived)');
        }

        await this.roomRepository.restore(roomId);

        // Notification
        await this.notificationsService.notifyUser(userId, {
            title: 'Habitación Restaurada',
            message: `La habitación ${room.number} ha sido restaurada con éxito`,
            type: NotificationType.INFO,
            orgId: companyId
        });
    }

    // --- RECYCLE BIN LISTS ---

    async listArchivedFloors(companyId: string): Promise<HotelFloor[]> {
        return this.floorRepository.find({
            where: {
                companyId,
                deletedAt: Not(IsNull())
            },
            withDeleted: true,
            order: { deletedAt: 'DESC' }
        });
    }

    async listArchivedRooms(companyId: string): Promise<HotelRoom[]> {
        return this.roomRepository.find({
            where: {
                companyId,
                deletedAt: Not(IsNull())
            },
            withDeleted: true,
            relations: ['floor', 'category'],
            order: { deletedAt: 'DESC' }
        });
    }
}
