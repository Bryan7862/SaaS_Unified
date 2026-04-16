import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('hotel_room_categories')
export class RoomCategory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string; // Simple, Doble, Matrimonial, Suite

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    basePrice: number;

    @Column()
    capacity: number; // Max guests

    @Column()
    companyId: string; // Tenant Isolation

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
