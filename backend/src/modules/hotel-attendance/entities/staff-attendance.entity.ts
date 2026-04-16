import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export enum ShiftType {
    DAY = 'DAY',
    NIGHT = 'NIGHT'
}

@Entity('staff_attendance')
export class StaffAttendance {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'company_id' })
    companyId: string;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'timestamp', name: 'check_in_time' })
    checkInTime: Date;

    @Column({ type: 'timestamp', name: 'check_out_time', nullable: true })
    checkOutTime: Date;

    @Column({
        type: 'simple-enum',
        enum: ShiftType,
        name: 'shift_type'
    })
    shiftType: ShiftType;

    @Column({ type: 'date', name: 'work_date' })
    workDate: string; // YYYY-MM-DD
}
