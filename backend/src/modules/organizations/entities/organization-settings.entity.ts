import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Company } from "./company.entity";

@Entity("organization_settings")
export class OrganizationSettings {
  @PrimaryColumn("uuid")
  companyId: string;

  @OneToOne(() => Company, (company) => company.settings, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "company_id" })
  company: Company;

  @Column({ default: "UTC" })
  timezone: string;

  @Column({ default: "USD" })
  currency: string; // PEN, USD, EUR (Validating via Service)

  @Column({ default: "DD/MM/YYYY" })
  dateFormat: string; // DD/MM/YYYY, MM/DD/YYYY

  @Column({ default: true, name: "notifications_enabled" })
  notificationsEnabled: boolean;

  @Column({ default: "system" })
  theme: string; // light, dark, system

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
