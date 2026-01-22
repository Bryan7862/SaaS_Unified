import { useState, useEffect } from 'react';
import { Clock, History, Calendar, Sun, Moon } from 'lucide-react';
import { clockIn, clockOut, getHistory, AttendanceRecord, ShiftType } from '../api';
import { notify } from '../../../lib/notify';

export const StaffAttendancePage = () => {
    const [history, setHistory] = useState<AttendanceRecord[]>([]);
    const [activeShift, setActiveShift] = useState<AttendanceRecord | null>(null);
    const [selectedShiftType, setSelectedShiftType] = useState<ShiftType>(ShiftType.DAY);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const res = await getHistory();
            setHistory(res.data);

            // Check for active shift (most recent record with no checkout)
            // Backend returns DESC order, so first element is most recent
            const mostRecent = res.data[0];
            if (mostRecent && !mostRecent.checkOutTime) {
                setActiveShift(mostRecent);
            } else {
                setActiveShift(null);
            }
        } catch (error) {
            console.error(error);
            notify.error('Error al cargar historial');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClockIn = async () => {
        setIsProcessing(true);
        try {
            await clockIn(selectedShiftType);
            notify.success('¡Entrada marcada con éxito!');
            await loadData();
        } catch (error: any) {
            console.error(error);
            if (error.response?.status === 409) {
                notify.error('Ya tienes un turno abierto');
            } else {
                notify.error('Error al marcar entrada');
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClockOut = async () => {
        setIsProcessing(true);
        try {
            await clockOut();
            notify.success('¡Salida marcada con éxito!');
            await loadData();
        } catch (error) {
            console.error(error);
            notify.error('Error al marcar salida');
        } finally {
            setIsProcessing(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
    };

    const formatTime = (timeString?: string) => {
        if (!timeString) return '--:--';
        return new Date(timeString).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="max-w-md mx-auto pb-20">
            {/* Header */}
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900">Control de Asistencia</h1>
                <p className="text-gray-500">Registra tu jornada laboral.</p>
            </div>

            {/* Main Action Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 text-center">
                {isLoading ? (
                    <div className="py-10 text-gray-400">Cargando estado...</div>
                ) : activeShift ? (
                    <div className="animate-in fade-in duration-300">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                            <Clock size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Turno Activo</h2>
                        <p className="text-gray-500 mb-6">Iniciado a las {formatTime(activeShift.checkInTime)}</p>

                        <button
                            onClick={handleClockOut}
                            disabled={isProcessing}
                            className="w-full bg-black text-white py-4 rounded-xl font-medium text-lg shadow-lg shadow-gray-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            {isProcessing ? 'Procesando...' : 'Marcar Salida'}
                        </button>
                    </div>
                ) : (
                    <div className="animate-in fade-in duration-300">
                        <div className="flex justify-center gap-4 mb-6">
                            <button
                                onClick={() => setSelectedShiftType(ShiftType.DAY)}
                                className={`flex-1 py-3 px-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${selectedShiftType === ShiftType.DAY
                                        ? 'border-black bg-gray-50 text-black'
                                        : 'border-gray-100 text-gray-400 hover:border-gray-200'
                                    }`}
                            >
                                <Sun size={24} />
                                <span className="font-medium">Día</span>
                            </button>
                            <button
                                onClick={() => setSelectedShiftType(ShiftType.NIGHT)}
                                className={`flex-1 py-3 px-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${selectedShiftType === ShiftType.NIGHT
                                        ? 'border-black bg-gray-900 text-white'
                                        : 'border-gray-100 text-gray-400 hover:border-gray-200'
                                    }`}
                            >
                                <Moon size={24} />
                                <span className="font-medium">Noche</span>
                            </button>
                        </div>

                        <button
                            onClick={handleClockIn}
                            disabled={isProcessing}
                            className="w-full bg-black text-white py-4 rounded-xl font-medium text-lg shadow-lg shadow-gray-200 active:scale-95 transition-all"
                        >
                            {isProcessing ? 'Procesando...' : 'Marcar Entrada'}
                        </button>
                    </div>
                )}
            </div>

            {/* History Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-900 font-semibold px-2">
                    <History size={18} />
                    <h2>Historial Reciente</h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden divide-y">
                    {history.length === 0 ? (
                        <div className="p-6 text-center text-gray-400 text-sm">No hay registros recientes.</div>
                    ) : (
                        history.map((record) => (
                            <div key={record.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${record.shiftType === ShiftType.DAY ? 'bg-orange-50 text-orange-500' : 'bg-purple-50 text-purple-500'
                                        }`}>
                                        {record.shiftType === ShiftType.DAY ? <Sun size={18} /> : <Moon size={18} />}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{formatDate(record.workDate)}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                            <Calendar size={10} />
                                            {record.shiftType === ShiftType.DAY ? 'Turno Día' : 'Turno Noche'}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-medium text-gray-900">{formatTime(record.checkInTime)} - {formatTime(record.checkOutTime)}</div>
                                    <div className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${record.checkOutTime ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'
                                        }`}>
                                        {record.checkOutTime ? 'Completado' : 'En curso'}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
