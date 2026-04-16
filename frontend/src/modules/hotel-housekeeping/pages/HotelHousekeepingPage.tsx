import { useState, useEffect } from 'react';
import { CheckCircle, RefreshCw, DollarSign } from 'lucide-react';
import { getRooms } from '../../hotel-rooms/api'; // Reuse existing to get all rooms
import { markRoomAsClean } from '../api';
import { ConsumptionModal } from '../components/ConsumptionModal';
import { notify } from '../../../lib/notify';

// Define strict type for room locally or import if available
interface HotelRoom {
    id: string;
    number: string;
    status: 'AVAILABLE' | 'OCCUPIED' | 'CLEANING' | 'MAINTENANCE' | 'DIRTY';
    category?: { name: string };
    companyId: string;
}

export const HotelHousekeepingPage = () => {
    const [allRooms, setAllRooms] = useState<HotelRoom[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessingStatus, setIsProcessingStatus] = useState<string | null>(null); // Id of room being processed

    // Modal State
    const [consumptionModalData, setConsumptionModalData] = useState<{ isOpen: boolean; roomId: string; roomNumber: string }>({
        isOpen: false,
        roomId: '',
        roomNumber: ''
    });

    useEffect(() => {
        loadRooms();
    }, []);

    const loadRooms = async () => {
        setIsLoading(true);
        try {
            const data = await getRooms();
            setAllRooms(data);
        } catch (error) {
            console.error(error);
            notify.error('Error al cargar habitaciones');
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkAsClean = async (roomId: string) => {
        setIsProcessingStatus(roomId);
        try {
            await markRoomAsClean(roomId);
            notify.success('Habitación marcada como LISTA');
            loadRooms(); // Refresh
        } catch (error) {
            console.error(error);
            notify.error('Error al actualizar estado');
        } finally {
            setIsProcessingStatus(null);
        }
    };

    const openConsumptionModal = (roomId: string, roomNumber: string) => {
        setConsumptionModalData({ isOpen: true, roomId, roomNumber });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'AVAILABLE':
                return <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Disponible</span>;
            case 'OCCUPIED':
                return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Ocupada</span>;
            case 'CLEANING':
            case 'DIRTY':
                return <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide flex items-center gap-1"><RefreshCw size={12} className="animate-spin" /> Limpieza</span>;
            case 'MAINTENANCE':
                return <span className="bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Mantenimiento</span>;
            default:
                return null;
        }
    };

    return (
        <div className="pb-20">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Operaciones</h1>
                <p className="text-gray-500">Gestión de limpieza y minibar.</p>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="text-center py-10 text-gray-500">Cargando habitaciones...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {allRooms.map((room) => (
                        <div
                            key={room.id}
                            className={`
                                bg-white rounded-xl shadow-sm border p-5 flex flex-col justify-between h-56 transition-all
                                ${room.status === 'OCCUPIED' ? 'border-blue-100 hover:border-blue-300 cursor-pointer group relative' : 'border-gray-100'}
                            `}
                            onClick={() => {
                                if (room.status === 'OCCUPIED') openConsumptionModal(room.id, room.number);
                            }}
                        >
                            {/* Card Top */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-3xl font-bold text-gray-900">{room.number}</span>
                                    <div className="text-sm text-gray-500 mt-1">{room.category?.name || 'Estándar'}</div>
                                </div>
                                {getStatusBadge(room.status)}
                            </div>

                            {/* Card Actions / State Info */}
                            <div className="mt-4">
                                {['CLEANING', 'DIRTY', 'MAINTENANCE'].includes(room.status) ? (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleMarkAsClean(room.id); }}
                                        disabled={isProcessingStatus === room.id}
                                        className="w-full bg-black text-white py-3 rounded-xl font-medium shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isProcessingStatus === room.id ? <RefreshCw className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                                        Finalizar Limpieza
                                    </button>
                                ) : room.status === 'OCCUPIED' ? (
                                    <div className="w-full h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-medium group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <DollarSign size={18} className="mr-2" />
                                        Registrar Consumo
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-green-600 font-medium justify-center h-12 bg-green-50 rounded-xl">
                                        <CheckCircle size={18} />
                                        <span>Lista para usar</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Contextual Modal */}
            <ConsumptionModal
                isOpen={consumptionModalData.isOpen}
                onClose={() => setConsumptionModalData(prev => ({ ...prev, isOpen: false }))}
                roomId={consumptionModalData.roomId}
                roomNumber={consumptionModalData.roomNumber}
                onSuccess={() => { }}
            />
        </div>
    );
};
