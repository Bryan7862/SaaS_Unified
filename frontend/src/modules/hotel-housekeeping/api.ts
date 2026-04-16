import { api } from '../../lib/api';

export interface RegisterConsumptionDto {
    roomId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
}

export const markRoomAsClean = async (id: string) => {
    return api.patch(`/hotel-housekeeping/rooms/${id}/clean`);
};

export const registerMinibarConsumption = async (data: RegisterConsumptionDto) => {
    return api.post('/hotel-housekeeping/consumption', data);
};
