import { api } from '../../lib/api';

// Comportamiento: Todas las peticiones incluyen organization_id vía interceptor o contexto global (managed by api instance usually)

export const fetchOccupancyRack = async (_startDate: string, _endDate: string) => {
    // Helper to get all data needed for the Rack: Rooms (structure) + Bookings (data)
    // Ideally this would be a specialized endpoint, but we can compose it here or use existing
    const [roomsRes, bookingsRes] = await Promise.all([
        api.get('/hotel-rooms/rooms'),
        api.get('/hotel-bookings') // In a real app we would filter by date range here
    ]);

    return {
        rooms: roomsRes.data,
        bookings: bookingsRes.data
    };
};

export const createNewBooking = async (data: { roomId: string; guestId: string; checkInDate: string; checkOutDate: string; totalAmount: number }) => {
    return api.post('/hotel-bookings', data);
};

export const executeCheckIn = async (bookingId: string) => {
    return api.post(`/hotel-bookings/${bookingId}/check-in`);
};

export const executeCheckOut = async (bookingId: string) => {
    return api.post(`/hotel-bookings/${bookingId}/check-out`);
};

// Mock or Placeholder for Guest Search as module is not yet fully implemented
export const searchGuestByDni = async (_dni: string) => {
    // Return empty or mock for now to allow UI development
    // In future: return api.get(`/hotel-guests?documentNumber=${dni}`);
    return [];
};

// Utilities
export const calculateBookingTotal = (pricePerNight: number, checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return (diffDays || 1) * pricePerNight;
};
