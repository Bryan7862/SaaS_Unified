import { useState, useEffect } from 'react';
import { Plus, LayoutGrid, Bed, Trash2 } from 'lucide-react';
import { getFloors, createFloor, getCategories, getRooms, createRoom, archiveFloor, archiveRoom } from '../api';
import { notify } from '../../../lib/notify';

export const HotelRoomsPage = () => {
    // ... (Existing state initialization)
    const [activeTab, setActiveTab] = useState<'rooms' | 'floors'>('rooms');
    const [isLoading, setIsLoading] = useState(true);

    const [floors, setFloors] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [rooms, setRooms] = useState<any[]>([]);

    const [showRoomForm, setShowRoomForm] = useState(false);

    // Form States
    const [newFloor, setNewFloor] = useState({ number: '', description: '' });
    const [newRoom, setNewRoom] = useState({ number: '', floorId: '', categoryId: '', status: 'AVAILABLE' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [floorsData, categoriesData, roomsData] = await Promise.all([
                getFloors(),
                getCategories(),
                getRooms()
            ]);
            setFloors(floorsData);
            setCategories(categoriesData);
            setRooms(roomsData);
        } catch (error) {
            console.error('Error loading data', error);
            notify.error('Error al cargar datos del hotel');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateFloor = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createFloor({
                number: parseInt(newFloor.number),
                description: newFloor.description
            });
            notify.success('Piso registrado correctamente');
            // Form is always visible, no need to hide
            setNewFloor({ number: '', description: '' });
            loadData();
        } catch (error: any) {
            if (error.response?.status === 409) {
                notify.error('El número de piso ya está registrado');
            } else {
                notify.error('Error al crear piso');
            }
        }
    };

    const handleArchiveFloor = async (id: string, roomCount: number) => {
        if (roomCount > 0) {
            // Backend also validates this, but good for UI feedback
            if (!confirm('Este piso tiene habitaciones. ¿Estás seguro de que deseas archivarlo (si no están ocupadas)?')) return;
        } else {
            if (!confirm('¿Estás seguro de que deseas archivar este piso?')) return;
        }

        try {
            await archiveFloor(id);
            notify.success('Piso archivado correctamente');
            loadData();
        } catch (error: any) {
            if (error.response?.status === 409) {
                notify.error('No se puede archivar: tiene habitaciones ocupadas');
            } else {
                notify.error('Error al archivar piso');
            }
        }
    };

    // ... (Existing handleCreateRoom)

    const handleCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createRoom(newRoom);
            notify.success('Habitación registrada correctamente');
            setShowRoomForm(false);
            setNewRoom({ number: '', floorId: '', categoryId: '', status: 'AVAILABLE' });
            loadData();
        } catch (error: any) {
            if (error.response?.status === 409) {
                notify.error('El número de habitación ya existe');
            } else {
                notify.error('Error al crear habitación');
            }
        }
    };

    // ... (Existing handleCreateRoom)

    const handleArchiveRoom = async (id: string, roomNumber: string) => {
        if (!confirm(`¿Estás seguro de que deseas archivar la habitación ${roomNumber}?`)) {
            return;
        }

        try {
            await archiveRoom(id);
            notify.success('Habitación archivada correctamente');
            loadData();
        } catch (error: any) {
            if (error.response?.status === 409) {
                notify.error('No se puede archivar: tiene reservas activas o futuras');
            } else {
                notify.error('Error al archivar habitación');
            }
        }
    };

    // ... (Render Helpers)

    // ... (Inside return statement, activeTab === 'floors')


    // --- RENDER HELPERS ---

    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <div className="p-4 bg-orange-100 text-orange-600 rounded-full mb-4">
                <LayoutGrid size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Configuración Inicial Requerida</h3>
            <p className="text-gray-600 max-w-md mb-6">
                Para comenzar a registrar habitaciones, primero necesitas definir los <strong>Pisos</strong> y las <strong>Categorías</strong> de tu hotel.
            </p>
            <button
                onClick={() => { setActiveTab('floors'); }}
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
                Registrar Primer Piso
            </button>
        </div>
    );

    if (isLoading) return <div className="p-8 text-center text-gray-500">Cargando gestión de habitaciones...</div>;

    const hasDependencies = floors.length > 0 && categories.length > 0;

    return (
        <div className="h-full flex flex-col gap-6 overflow-hidden">
            {/* Header section with Tabs */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-none">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text)]">Gestión de Habitaciones</h1>
                    <p className="text-[var(--muted)]">Administra la estructura física y capacidad de tu hotel.</p>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('rooms')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'rooms'
                            ? 'bg-white text-black shadow-sm'
                            : 'text-gray-500 hover:text-gray-800'
                            }`}
                    >
                        <span className="flex items-center gap-2"><Bed size={16} /> Habitaciones</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('floors')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'floors'
                            ? 'bg-white text-black shadow-sm'
                            : 'text-gray-500 hover:text-gray-800'
                            }`}
                    >
                        <span className="flex items-center gap-2"><LayoutGrid size={16} /> Pisos</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-0 overflow-auto">
                {activeTab === 'rooms' && (
                    <>
                        {!hasDependencies ? (
                            <EmptyState />
                        ) : (
                            <div className="flex flex-col gap-6">
                                {/* Action Bar */}
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setShowRoomForm(true)}
                                        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 flex items-center gap-2 font-medium"
                                    >
                                        <Plus size={18} /> Nueva Habitación
                                    </button>
                                </div>

                                {/* Rooms Grid/List using "User Directory" style cards/table */}
                                <div className="bg-[var(--card-bg)] rounded-lg shadow-sm border border-[var(--border)] overflow-hidden">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-[var(--border)] text-[var(--muted)] text-sm bg-gray-50">
                                                <th className="py-3 px-4">Número</th>
                                                <th className="py-3 px-4">Piso</th>
                                                <th className="py-3 px-4">Categoría</th>
                                                <th className="py-3 px-4">Estado</th>
                                                <th className="py-3 px-4 text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[var(--border)]">
                                            {rooms.map((room) => (
                                                <tr key={room.id} className="hover:bg-gray-50 group">
                                                    <td className="py-3 px-4 font-bold text-gray-800">{room.number}</td>
                                                    <td className="py-3 px-4 text-gray-600">
                                                        {room.floor?.description || `Piso ${room.floor?.number}`}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-semibold border border-indigo-100">
                                                            {room.category?.name}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${room.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700' :
                                                            room.status === 'OCCUPIED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                            {room.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-right text-sm flex justify-end items-center gap-3">
                                                        <span className="text-blue-600 cursor-pointer hover:underline">Editar</span>
                                                        <button
                                                            onClick={() => handleArchiveRoom(room.id, room.number)}
                                                            className="text-gray-400 hover:text-black transition-colors p-1"
                                                            title="Archivar Habitación"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {rooms.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="py-8 text-center text-gray-400">
                                                        No hay habitaciones registradas aún.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'floors' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Floor List */}
                        <div className="bg-[var(--card-bg)] rounded-lg shadow-sm border border-[var(--border)] p-4">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <LayoutGrid size={20} className="text-gray-500" />
                                Pisos Registrados
                            </h3>
                            <div className="space-y-3">
                                {floors.map(floor => (
                                    <div key={floor.id} className="flex justify-between items-center p-3 border border-gray-100 rounded bg-gray-50 group">
                                        <div>
                                            <span className="font-bold text-gray-900 block">Piso {floor.number}</span>
                                            <span className="text-sm text-gray-500">{floor.description || 'Sin descripción'}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">
                                                {floor.rooms?.length || 0} Habs
                                            </div>
                                            <button
                                                onClick={() => handleArchiveFloor(floor.id, floor.rooms?.length || 0)}
                                                className="text-gray-400 hover:text-black transition-colors p-1"
                                                title="Archivar Piso"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {floors.length === 0 && <p className="text-center text-gray-400 py-4">Sin pisos registrados</p>}
                            </div>
                        </div>

                        {/* Create Floor Form */}
                        <div className="bg-[var(--card-bg)] rounded-lg shadow-sm border border-[var(--border)] p-6 h-fit">
                            <h3 className="text-lg font-bold mb-4">Registrar Nuevo Piso</h3>
                            <form onSubmit={handleCreateFloor} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Número de Piso</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
                                        placeholder="Ej. 1, 2, -1"
                                        value={newFloor.number}
                                        onChange={e => setNewFloor({ ...newFloor, number: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción / Alias</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
                                        placeholder="Ej. Planta Baja, Mezzanine"
                                        value={newFloor.description}
                                        onChange={e => setNewFloor({ ...newFloor, description: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 font-medium">
                                    Guardar Piso
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Room Modal/Slide-over (Inline implementation for simplicity compliant with User Directory style) */}
            {showRoomForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Nueva Habitación</h2>
                            <button onClick={() => setShowRoomForm(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>

                        <form onSubmit={handleCreateRoom} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Número de Habitación</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-lg font-bold tracking-wider focus:outline-none border-l-4 border-l-black"
                                    placeholder="101"
                                    value={newRoom.number}
                                    onChange={e => setNewRoom({ ...newRoom, number: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Piso</label>
                                    <select
                                        required
                                        className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                                        value={newRoom.floorId}
                                        onChange={e => setNewRoom({ ...newRoom, floorId: e.target.value })}
                                    >
                                        <option value="">Seleccionar...</option>
                                        {floors.map(f => (
                                            <option key={f.id} value={f.id}>{f.description || `Piso ${f.number}`}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                                    <select
                                        required
                                        className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                                        value={newRoom.categoryId}
                                        onChange={e => setNewRoom({ ...newRoom, categoryId: e.target.value })}
                                    >
                                        <option value="">Seleccionar...</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setShowRoomForm(false)} className="flex-1 px-4 py-2 border rounded hover:bg-gray-50">
                                    Cancelar
                                </button>
                                <button type="submit" className="flex-1 bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                                    Crear Habitación
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
