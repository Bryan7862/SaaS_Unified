import { api } from '../../lib/api';

export const getFloors = async () => {
    const response = await api.get('/hotel-rooms/floors');
    return response.data;
};

export const createFloor = async (data: { number: number; description: string }) => {
    return api.post('/hotel-rooms/floors', data);
};

export const deleteFloor = async (id: string) => {
    return api.delete(`/hotel-rooms/floors/${id}`);
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

export const deleteRoom = async (id: string) => {
    return api.delete(`/hotel-rooms/${id}`);
};

export const archiveFloor = async (id: string) => {
    return api.patch(`/hotel-rooms/floors/${id}/archive`);
};

export const restoreFloor = async (id: string) => {
    return api.patch(`/hotel-rooms/floors/${id}/restore`);
};

export const archiveRoom = async (id: string) => {
    return api.patch(`/hotel-rooms/rooms/${id}/archive`);
};

export const restoreRoom = async (id: string) => {
    return api.patch(`/hotel-rooms/rooms/${id}/restore`);
};

export const getArchivedFloors = async () => {
    return api.get('/hotel-rooms/floors/archived').then(res => res.data);
};

export const getArchivedRooms = async () => {
    return api.get('/hotel-rooms/rooms/archived').then(res => res.data);
};
