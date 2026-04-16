import {
  IsDateString,
  IsNumber,
  IsUUID,
  IsEnum,
  IsOptional,
} from "class-validator";
import { BookingStatus } from "../entities/hotel-booking.entity";

export class CreateBookingDto {
  @IsUUID()
  roomId: string;

  @IsUUID()
  guestId: string;

  @IsDateString()
  checkInDate: string;

  @IsDateString()
  checkOutDate: string;

  @IsNumber()
  totalAmount: number;

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}
