import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from "typeorm";

@Entity("hotel_guests")
@Unique(["companyId", "documentNumber"]) // Unique document per company
export class HotelGuest {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "company_id" })
  companyId: string;

  @Column({ name: "first_name" })
  firstName: string;

  @Column({ name: "last_name" })
  lastName: string;

  @Column({ name: "document_type" })
  documentType: string; // DNI, PASSPORT, CE

  @Column({ name: "document_number" })
  documentNumber: string;

  @Column({ nullable: true })
  nationality: string;

  @Column({ name: "city_of_origin", nullable: true })
  cityOfOrigin: string;

  @Column({ name: "phone_number", nullable: true })
  phoneNumber: string;

  @Column({ name: "email", nullable: true })
  email: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
