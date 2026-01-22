import { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { CreateGuestDto, createGuest, updateGuest, getGuestByDni } from '../api';
import { notify } from '../../../lib/notify';

interface GuestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any; // strict: HotelGuest
}

export const GuestModal = ({ isOpen, onClose, onSuccess, initialData }: GuestModalProps) => {
    const [formData, setFormData] = useState<CreateGuestDto>({
        firstName: '',
        lastName: '',
        documentType: 'DNI',
        documentNumber: '',
        nationality: '',
        phoneNumber: '',
        email: '',
        cityOfOrigin: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                firstName: initialData.firstName,
                lastName: initialData.lastName,
                documentType: initialData.documentType,
                documentNumber: initialData.documentNumber,
                nationality: initialData.nationality || '',
                phoneNumber: initialData.phoneNumber || '',
                email: initialData.email || '',
                cityOfOrigin: initialData.cityOfOrigin || ''
            });
        } else {
            setFormData({
                firstName: '',
                lastName: '',
                documentType: 'DNI',
                documentNumber: '',
                nationality: '',
                phoneNumber: '',
                email: '',
                cityOfOrigin: ''
            });
        }
        setDuplicateWarning(null);
    }, [initialData, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'documentNumber') {
            setDuplicateWarning(null);
        }
    };

    const checkDuplicate = async () => {
        if (!formData.documentNumber || initialData) return; // Don't check on edit if not changed (logic simplified)

        try {
            const res = await getGuestByDni(formData.documentNumber);
            if (res.data) {
                setDuplicateWarning(`El huésped ${res.data.firstName} ${res.data.lastName} ya existe con este documento.`);
            }
        } catch (error) {
            // Ignore if 404 or other error
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (initialData) {
                await updateGuest(initialData.id, formData);
                notify.success('Huésped actualizado correctamente');
            } else {
                await createGuest(formData);
                notify.success('Huésped registrado correctamente');
            }
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error(error);
            if (error.response?.status === 409) {
                notify.error('Error: El número de documento ya existe en esta organización.');
            } else {
                notify.error('Error al guardar huésped');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-900">
                        {initialData ? 'Editar Huésped' : 'Nuevo Huésped'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Document Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Documento</label>
                            <select
                                name="documentType"
                                value={formData.documentType}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                            >
                                <option value="DNI">DNI</option>
                                <option value="PASSPORT">Pasaporte</option>
                                <option value="CE">Carnet Extranjería</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Número de Documento</label>
                            <input
                                type="text"
                                name="documentNumber"
                                value={formData.documentNumber}
                                onChange={handleChange}
                                onBlur={checkDuplicate}
                                className={`w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black focus:border-transparent ${duplicateWarning ? 'border-red-500 bg-red-50' : ''}`}
                                required
                            />
                            {duplicateWarning && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle size={12} /> {duplicateWarning}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Personal Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombres</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nacionalidad</label>
                            <input
                                type="text"
                                name="nationality"
                                value={formData.nationality}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad de Origen</label>
                            <input
                                type="text"
                                name="cityOfOrigin"
                                value={formData.cityOfOrigin}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium"
                        >
                            <Save size={18} />
                            {isLoading ? 'Guardando...' : 'Guardar Huésped'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
