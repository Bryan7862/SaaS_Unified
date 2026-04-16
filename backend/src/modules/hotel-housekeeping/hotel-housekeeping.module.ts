import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HousekeepingService } from './hotel-housekeeping.service';
import { HousekeepingController } from './hotel-housekeeping.controller';
import { MinibarConsumption } from './entities/minibar-consumption.entity';
import { HotelRoom } from '../hotel-rooms/entities/hotel-room.entity';
import { HotelBooking } from '../hotel-bookings/entities/hotel-booking.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([MinibarConsumption, HotelRoom, HotelBooking])
    ],
    controllers: [HousekeepingController],
    providers: [HousekeepingService],
    exports: [HousekeepingService]
})
export class HotelHousekeepingModule { }
