import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Not } from "typeorm";
import { HotelBooking, BookingStatus } from "./entities/hotel-booking.entity";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { HotelRoom } from "../hotel-rooms/entities/hotel-room.entity";
import { HotelGuest } from "../hotel-guests/entities/hotel-guest.entity";

@Injectable()
export class HotelBookingsService {
  constructor(
    @InjectRepository(HotelBooking)
    private bookingRepository: Repository<HotelBooking>,
    @InjectRepository(HotelRoom)
    private roomRepository: Repository<HotelRoom>,
    @InjectRepository(HotelGuest)
    private guestRepository: Repository<HotelGuest>,
  ) {}

  async createBooking(
    createBookingDto: CreateBookingDto,
    companyId: string,
  ): Promise<HotelBooking> {
    const { roomId, guestId, checkInDate, checkOutDate, totalAmount } =
      createBookingDto;

    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      throw new BadRequestException(
        "Check-out date must be after check-in date.",
      );
    }

    // Validate consistency
    const room = await this.roomRepository.findOne({
      where: { id: roomId, companyId },
    });
    if (!room)
      throw new NotFoundException(
        "Room not found or does not belong to this organization.",
      );

    const guest = await this.guestRepository.findOne({
      where: { id: guestId, companyId },
    });
    if (!guest)
      throw new NotFoundException(
        "Guest not found or does not belong to this organization.",
      );

    // Availability Check
    await this.checkRoomAvailability(
      roomId,
      new Date(checkInDate),
      new Date(checkOutDate),
      companyId,
    );

    const booking = this.bookingRepository.create({
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
      totalAmount,
      status: createBookingDto.status || BookingStatus.PENDING,
      room,
      guest,
      companyId,
    });

    return this.bookingRepository.save(booking);
  }

  async checkRoomAvailability(
    roomId: string,
    start: Date,
    end: Date,
    companyId: string,
  ): Promise<void> {
    // Query logic: overlap if (start < existingEnd) AND (end > existingStart)
    // status != CANCELLED and status != CHECKED_OUT (checked out means done, but overlapping dates might still matter in history?
    // usually availability cares about future or current active bookings.
    // simpler: status IN (PENDING, CONFIRMED, CHECKED_IN)

    const conflictingBooking = await this.bookingRepository
      .createQueryBuilder("booking")
      .where("booking.room_id = :roomId", { roomId })
      .andWhere("booking.companyId = :companyId", { companyId })
      .andWhere("booking.status IN (:...statuses)", {
        statuses: [
          BookingStatus.PENDING,
          BookingStatus.CONFIRMED,
          BookingStatus.CHECKED_IN,
        ],
      })
      .andWhere(
        "(booking.checkInDate < :end AND booking.checkOutDate > :start)",
        { start, end },
      )
      .getOne();

    if (conflictingBooking) {
      throw new ConflictException(
        "Room is not available for the selected dates.",
      );
    }
  }

  async processCheckIn(
    bookingId: string,
    companyId: string,
  ): Promise<HotelBooking> {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId, companyId },
      relations: ["room"],
    });

    if (!booking) throw new NotFoundException("Booking not found.");
    if (
      booking.status !== BookingStatus.CONFIRMED &&
      booking.status !== BookingStatus.PENDING
    ) {
      throw new BadRequestException(
        `Cannot check-in booking with status ${booking.status}`,
      );
    }

    // Update Booking Status
    booking.status = BookingStatus.CHECKED_IN;

    // Update Room Status
    // Note: We access the room via relation. We should also save the room.
    const room = booking.room;
    room.status = "OCCUPIED";

    await this.roomRepository.save(room);
    return this.bookingRepository.save(booking);
  }

  async processCheckOut(
    bookingId: string,
    companyId: string,
  ): Promise<HotelBooking> {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId, companyId },
      relations: ["room"],
    });

    if (!booking) throw new NotFoundException("Booking not found.");
    if (booking.status !== BookingStatus.CHECKED_IN) {
      throw new BadRequestException(
        `Cannot check-out booking with status ${booking.status}`,
      );
    }

    // Update Booking Status
    booking.status = BookingStatus.CHECKED_OUT;

    // Update Room Status
    const room = booking.room;
    room.status = "CLEANING"; // As requested

    await this.roomRepository.save(room);
    return this.bookingRepository.save(booking);
  }

  async listBookings(companyId: string): Promise<HotelBooking[]> {
    return this.bookingRepository.find({
      where: { companyId },
      relations: ["room", "guest"],
      order: { createdAt: "DESC" },
    });
  }

  async findActiveBookingsByRoom(
    roomId: string,
    companyId: string,
  ): Promise<HotelBooking[]> {
    return this.bookingRepository.find({
      where: {
        room: { id: roomId },
        companyId,
        status: Not(BookingStatus.CANCELLED),
      },
      relations: ["guest"],
    });
  }
}
