import { useState, useEffect } from 'react';
import { Search, Plus, User, Edit, Archive } from 'lucide-react';
import { fetchGuests, HotelGuest } from '../api';
import { GuestModal } from '../components/GuestModal';
import { notify } from '../../../lib/notify';

export const HotelGuestsPage = () => {
    // --- State ---
    const [guestList, setGuestList] = useState<HotelGuest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState<HotelGuest | undefined>(undefined);

    // --- Effects ---
    useEffect(() => {
        loadGuests();
    }, []);

    // --- Actions ---
    const loadGuests = async (documentNumber?: string) => {
        setIsLoading(true);
        try {
            const res = await fetchGuests(documentNumber);
            // API might return array or single object if filtered by doc number incorrectly?
            // The service returns array for listAll, single object for findOne.
            // The controller: `findGuestByDocumentNumber` returns single entity, `listAllGuestsByCompany` returns array.
            // We need to handle this.
            if (Array.isArray(res.data)) {
                setGuestList(res.data);
            } else if (res.data) {
                setGuestList([res.data]);
            } else {
                setGuestList([]);
            }
        } catch (error) {
            console.error('Error loading guests', error);
            notify.error('Error al cargar lista de huéspedes');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadGuests(searchQuery || undefined);
    };

    const handleCreate = () => {
        setSelectedGuest(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (guest: HotelGuest) => {
        setSelectedGuest(guest);
        setIsModalOpen(true);
    };

    const handleSuccess = () => {
        loadGuests(searchQuery || undefined);
    };

    return (
        <div className="h-full flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Huéspedes</h1>
                    <p className="text-gray-500">Directorio de clientes registrados en el hotel.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    <span>Nuevo Huésped</span>
                </button>
            </div>

            {/* Search & Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por DNI, Pasaporte..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                        Buscar
                    </button>
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => { setSearchQuery(''); loadGuests(); }}
                            className="text-gray-500 hover:text-black px-2"
                        >
                            Limpiar
                        </button>
                    )}
                </form>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-1">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 font-semibold text-gray-700">Huésped</th>
                                <th className="p-4 font-semibold text-gray-700">Documento</th>
                                <th className="p-4 font-semibold text-gray-700">Origen</th>
                                <th className="p-4 font-semibold text-gray-700">Contacto</th>
                                <th className="p-4 font-semibold text-gray-700 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {isLoading ? (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Cargando...</td></tr>
                            ) : guestList.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-500">No se encontraron huéspedes.</td></tr>
                            ) : (
                                guestList.map((guest) => (
                                    <tr key={guest.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                                                    <User size={18} />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{guest.firstName} {guest.lastName}</div>
                                                    <div className="text-xs text-gray-500">Registrado el {new Date(guest.createdAt).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border">
                                                {guest.documentType}
                                            </span>
                                            <span className="ml-2 text-sm text-gray-600 font-mono">{guest.documentNumber}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm text-gray-900">{guest.nationality || '-'}</div>
                                            <div className="text-xs text-gray-500">{guest.cityOfOrigin}</div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {guest.email && <div>{guest.email}</div>}
                                            {guest.phoneNumber && <div>{guest.phoneNumber}</div>}
                                            {!guest.email && !guest.phoneNumber && <span className="text-gray-400">-</span>}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => notify.info('Historial en desarrollo')}
                                                    className="p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-black transition-colors"
                                                    title="Ver Historial"
                                                >
                                                    <Archive size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(guest)}
                                                    className="p-2 rounded hover:bg-black hover:text-white text-gray-500 transition-all shadow-sm"
                                                    title="Editar"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <GuestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
                initialData={selectedGuest}
            />
        </div>
    );
};
