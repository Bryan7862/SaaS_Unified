import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('attendance_records')
export class AttendanceRecord {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column({ type: 'timestamp' })
    checkInTime: Date;

    @Column({ type: 'timestamp', nullable: true })
    checkOutTime: Date;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column()
    companyId: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
