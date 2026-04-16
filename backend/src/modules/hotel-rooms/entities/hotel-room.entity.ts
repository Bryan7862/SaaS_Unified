import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from "typeorm";
import { RoomCategory } from "./room-category.entity";
import { HotelFloor } from "./hotel-floor.entity";

export enum RoomStatus {
  AVAILABLE = "AVAILABLE",
  OCCUPIED = "OCCUPIED",
  CLEANING = "CLEANING",
  MAINTENANCE = "MAINTENANCE",
  DIRTY = "DIRTY",
}

@Entity("hotel_rooms")
export class HotelRoom {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  number: string; // '101', '102' - Unique per companyId

  @ManyToOne(() => HotelFloor, (floor) => floor.rooms, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "floor_id" })
  floor: HotelFloor;

  @Column({ default: "AVAILABLE" })
  status: string; // AVAILABLE, OCCUPIED, DIRTY, MAINTENANCE

  @ManyToOne(() => RoomCategory, { nullable: false })
  @JoinColumn({ name: "category_id" })
  category: RoomCategory;

  @Column()
  companyId: string; // Tenant Isolation

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: Date;
}
