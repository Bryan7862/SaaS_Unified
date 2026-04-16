import {
  Injectable,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, IsNull } from "typeorm";
import { StaffAttendance, ShiftType } from "./entities/staff-attendance.entity";
import { User } from "../auth/entities/user.entity";

@Injectable()
export class HotelAttendanceService {
  constructor(
    @InjectRepository(StaffAttendance)
    private attendanceRepository: Repository<StaffAttendance>,
  ) {}

  async clockIn(
    userId: string,
    companyId: string,
    shiftType: ShiftType,
  ): Promise<StaffAttendance> {
    // 1. Check if user has an open session (no check-out)
    const openSession = await this.attendanceRepository.findOne({
      where: {
        user: { id: userId },
        companyId,
        checkOutTime: IsNull(),
      },
    });

    if (openSession) {
      throw new ConflictException(
        "User already has an open session. Please clock out first.",
      );
    }

    // 2. Check if user already clocked in for this shift today? (Optional rule, but prompt asked "validate user no tenga ya un clockIn para el mismo día")
    const today = new Date().toISOString().split("T")[0];
    const existingRecord = await this.attendanceRepository.findOne({
      where: {
        user: { id: userId },
        companyId,
        workDate: today,
      },
    });

    // Split shifts are common, so we rely on openSession check.

    const attendance = this.attendanceRepository.create({
      companyId,
      user: { id: userId } as User,
      shiftType,
      checkInTime: new Date(),
      workDate: today,
    });

    return this.attendanceRepository.save(attendance);
  }

  async clockOut(userId: string, companyId: string): Promise<StaffAttendance> {
    // Find most recent open session
    const openSession = await this.attendanceRepository.findOne({
      where: {
        user: { id: userId },
        companyId,
        checkOutTime: IsNull(),
      },
      order: { checkInTime: "DESC" },
    });

    if (!openSession) {
      throw new NotFoundException(
        "No active attendance session found to clock out.",
      );
    }

    openSession.checkOutTime = new Date();
    return this.attendanceRepository.save(openSession);
  }

  async getDailyAttendance(
    companyId: string,
    date: string,
  ): Promise<StaffAttendance[]> {
    return this.attendanceRepository.find({
      where: {
        companyId,
        workDate: date,
      },
      relations: ["user"],
      order: { checkInTime: "ASC" },
    });
  }

  async getUserHistory(
    userId: string,
    companyId: string,
  ): Promise<StaffAttendance[]> {
    return this.attendanceRepository.find({
      where: {
        user: { id: userId },
        companyId,
      },
      order: { checkInTime: "DESC" },
      take: 5,
    });
  }
}
