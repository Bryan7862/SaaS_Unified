import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { HotelRoom, RoomStatus } from '../hotel-rooms/entities/hotel-room.entity';
import { HotelBooking, BookingStatus } from '../hotel-bookings/entities/hotel-booking.entity';
import { MinibarConsumption } from './entities/minibar-consumption.entity';
import { RegisterConsumptionDto } from './dto/register-consumption.dto';

@Injectable()
export class HousekeepingService {
    constructor(
        @InjectRepository(HotelRoom)
        private roomRepository: Repository<HotelRoom>,
        @InjectRepository(HotelBooking)
        private bookingRepository: Repository<HotelBooking>,
        @InjectRepository(MinibarConsumption)
        private consumptionRepository: Repository<MinibarConsumption>,
        private dataSource: DataSource,
    ) { }

    async markRoomAsClean(companyId: string, roomId: string): Promise<HotelRoom> {
        const room = await this.roomRepository.findOne({ where: { id: roomId, companyId } });
        if (!room) throw new NotFoundException('Room not found');

        // Allow transition from Cleaning or Dirty to Available
        // If it's CLEANING, we assume the task is done.
        if (room.status !== RoomStatus.CLEANING && room.status !== RoomStatus.MAINTENANCE) {
            // Optional: Allow force clean from any state? usually only from dirty/cleaning
            // For now, let's allow it if it makes sense operationally, but standard flow is cleaning -> available
        }

        room.status = RoomStatus.AVAILABLE;
        return this.roomRepository.save(room);
    }

    async registerMinibarConsumption(companyId: string, dto: RegisterConsumptionDto): Promise<MinibarConsumption> {
        return this.dataSource.transaction(async (manager) => {
            // 1. Validate Room Status
            const room = await manager.findOne(HotelRoom, { where: { id: dto.roomId, companyId } });
            if (!room) throw new NotFoundException('Room not found');

            if (room.status !== RoomStatus.OCCUPIED) {
                throw new ConflictException('Consumption can only be registered for OCCUPIED rooms.');
            }

            // 2. Find Active Booking
            const activeBooking = await manager.findOne(HotelBooking, {
                where: {
                    room: { id: dto.roomId },
                    companyId,
                    status: BookingStatus.CHECKED_IN // Must be actively checked in
                }
            });

            if (!activeBooking) {
                throw new ConflictException('No active CHECKED_IN booking found for this room.');
            }

            // 3. Create Record
            const consumption = manager.create(MinibarConsumption, {
                companyId,
                booking: activeBooking,
                room: room,
                productName: dto.productName,
                quantity: dto.quantity,
                unitPrice: dto.unitPrice,
                totalPrice: dto.quantity * dto.unitPrice,
            });

            return manager.save(consumption);
        });
    }

    async getPendingCleaningRoomsByCompany(companyId: string): Promise<HotelRoom[]> {
        return this.roomRepository.find({
            where: [
                { companyId, status: RoomStatus.CLEANING },
                { companyId, status: RoomStatus.MAINTENANCE } // Pending tasks usually include maintenance
            ]
        });
    }
}
