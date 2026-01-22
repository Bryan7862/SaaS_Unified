import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HotelRoom } from './entities/hotel-room.entity';
import { HotelFloor } from './entities/hotel-floor.entity';
import { RoomCategory } from './entities/room-category.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { CreateFloorDto } from './dto/create-floor.dto';

@Injectable()
export class HotelRoomsService {
    constructor(
        @InjectRepository(HotelRoom)
        private readonly roomRepository: Repository<HotelRoom>,
        @InjectRepository(HotelFloor)
        private readonly floorRepository: Repository<HotelFloor>,
        @InjectRepository(RoomCategory)
        private readonly categoryRepository: Repository<RoomCategory>,
    ) { }

    // --- FLOORS ---

    async createFloorForOrganization(companyId: string, dto: CreateFloorDto): Promise<HotelFloor> {
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

    // --- ROOM CATEGORIES ---

    async listAllCategoriesByCompany(companyId: string): Promise<RoomCategory[]> {
        return this.categoryRepository.find({
            where: { companyId },
            order: { name: 'ASC' },
        });
    }

    // --- ROOMS ---

    async createNewRoomForOrganization(companyId: string, dto: CreateRoomDto): Promise<HotelRoom> {
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
}
