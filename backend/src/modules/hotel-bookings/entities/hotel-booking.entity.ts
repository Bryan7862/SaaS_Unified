import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { HotelRoom } from "../../hotel-rooms/entities/hotel-room.entity";
import { HotelGuest } from "../../hotel-guests/entities/hotel-guest.entity";

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CHECKED_IN = "CHECKED_IN",
  CHECKED_OUT = "CHECKED_OUT",
  CANCELLED = "CANCELLED",
}

@Entity("hotel_bookings")
export class HotelBooking {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "timestamp" })
  checkInDate: Date;

  @Column({ type: "timestamp" })
  checkOutDate: Date;

  @Column("decimal", { precision: 10, scale: 2 })
  totalAmount: number;

  @Column({
    type: "simple-enum",
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  // Relations
  @ManyToOne(() => HotelRoom, { nullable: false })
  @JoinColumn({ name: "room_id" })
  room: HotelRoom;

  @ManyToOne(() => HotelGuest, { nullable: false })
  @JoinColumn({ name: "guest_id" })
  guest: HotelGuest;

  // Multi-tenancy
  @Column()
  companyId: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
