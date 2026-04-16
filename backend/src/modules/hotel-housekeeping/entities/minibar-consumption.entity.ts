import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { HotelBooking } from '../../../modules/hotel-bookings/entities/hotel-booking.entity';
import { HotelRoom } from '../../../modules/hotel-rooms/entities/hotel-room.entity';

@Entity('minibar_consumptions')
export class MinibarConsumption {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'company_id' })
    companyId: string;

    @ManyToOne(() => HotelBooking, { nullable: false })
    @JoinColumn({ name: 'booking_id' })
    booking: HotelBooking;

    @ManyToOne(() => HotelRoom, { nullable: false })
    @JoinColumn({ name: 'room_id' })
    room: HotelRoom;

    @Column({ name: 'product_name' })
    productName: string;

    @Column('int')
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2, name: 'unit_price' })
    unitPrice: number;

    @Column('decimal', { precision: 10, scale: 2, name: 'total_price' })
    totalPrice: number;

    @CreateDateColumn({ name: 'consumed_at' })
    consumedAt: Date;
}
