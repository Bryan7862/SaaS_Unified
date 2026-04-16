import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
} from "typeorm";
import { HotelRoom } from "./hotel-room.entity";

@Entity("hotel_floors")
export class HotelFloor {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  number: number; // 1, 2, 3...

  @Column({ nullable: true })
  description: string; // "VIP Floor", "Ground Floor"

  @Column()
  companyId: string; // Tenant Isolation

  @OneToMany(() => HotelRoom, (room) => room.floor)
  rooms: HotelRoom[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: Date;
}
