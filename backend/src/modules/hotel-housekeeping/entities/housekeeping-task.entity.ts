import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('housekeeping_tasks')
export class HousekeepingTask {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    roomId: string; // Temporarily just ID, later relation

    @Column({ default: 'PENDING' })
    status: string; // PENDING, IN_PROGRESS, COMPLETED, INSPECTED

    @Column({ nullable: true })
    assignedTo: string; // User ID of cleaner

    @Column()
    companyId: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
