import { api } from '../../lib/api';

export enum ShiftType {
    DAY = 'DAY',
    NIGHT = 'NIGHT'
}

export interface AttendanceRecord {
    id: string;
    checkInTime: string;
    checkOutTime?: string;
    shiftType: ShiftType;
    workDate: string;
}

export const clockIn = async (shiftType: ShiftType) => {
    return api.post('/hotel-attendance/clock-in', { shiftType });
};

export const clockOut = async () => {
    return api.post('/hotel-attendance/clock-out');
};

export const getHistory = async () => {
    return api.get<AttendanceRecord[]>('/hotel-attendance/history');
};
