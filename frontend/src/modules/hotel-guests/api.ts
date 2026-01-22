import { api } from '../../lib/api';

export interface HotelGuest {
    id: string;
    companyId: string;
    firstName: string;
    lastName: string;
    documentType: string;
    documentNumber: string;
    nationality?: string;
    cityOfOrigin?: string;
    phoneNumber?: string;
    email?: string;
    createdAt: string;
}

export type CreateGuestDto = Omit<HotelGuest, 'id' | 'companyId' | 'createdAt'>;
export type UpdateGuestDto = Partial<CreateGuestDto>;

export const fetchGuests = async (documentNumber?: string) => {
    const params = documentNumber ? { documentNumber } : {};
    return api.get<HotelGuest[]>('/hotel-guests', { params });
};

export const createGuest = async (data: CreateGuestDto) => {
    return api.post<HotelGuest>('/hotel-guests', data);
};

export const updateGuest = async (id: string, data: UpdateGuestDto) => {
    return api.put<HotelGuest>(`/hotel-guests/${id}`, data);
};

export const getGuestByDni = async (dni: string) => {
    // This endpoint returns a single guest or null/empty if handled by generic list with filter
    // Based on controller: findAll(@Query('documentNumber') ...) returns findGuestByDocumentNumber (single) OR list
    // The service findGuestByDocumentNumber returns generic HotelGuest | null.
    // The controller returns that directly.
    return api.get<HotelGuest | null>(`/hotel-guests?documentNumber=${dni}`);
};
