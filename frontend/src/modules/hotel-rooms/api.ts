import { api } from '../../lib/api';

export const getFloors = async () => {
    const response = await api.get('/hotel-rooms/floors');
    return response.data;
};

export const createFloor = async (data: { number: number; description: string }) => {
    return api.post('/hotel-rooms/floors', data);
};

export const getCategories = async () => {
    const response = await api.get('/hotel-rooms/categories');
    return response.data;
};

export const getRooms = async () => {
    const response = await api.get('/hotel-rooms/rooms');
    return response.data;
};

export const createRoom = async (data: { number: string; floorId: string; categoryId: string; status: string }) => {
    return api.post('/hotel-rooms/rooms', data);
};
