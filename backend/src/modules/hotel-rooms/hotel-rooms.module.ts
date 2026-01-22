import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelRoomsService } from './hotel-rooms.service';
import { HotelRoomsController } from './hotel-rooms.controller';
import { HotelRoom } from './entities/hotel-room.entity';
import { RoomCategory } from './entities/room-category.entity';
import { HotelFloor } from './entities/hotel-floor.entity';

@Module({
    imports: [TypeOrmModule.forFeature([HotelRoom, RoomCategory, HotelFloor])],
    controllers: [HotelRoomsController],
    providers: [HotelRoomsService],
    exports: [HotelRoomsService],
})
export class HotelRoomsModule { }
