import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HotelBookingsService } from "./hotel-bookings.service";
import { HotelBookingsController } from "./hotel-bookings.controller";
import { HotelBooking } from "./entities/hotel-booking.entity";
import { HotelRoom } from "../hotel-rooms/entities/hotel-room.entity";
import { HotelGuest } from "../hotel-guests/entities/hotel-guest.entity";

@Module({
  imports: [TypeOrmModule.forFeature([HotelBooking, HotelRoom, HotelGuest])],
  controllers: [HotelBookingsController],
  providers: [HotelBookingsService],
})
export class HotelBookingsModule {}
