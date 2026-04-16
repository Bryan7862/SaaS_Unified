import { useState } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { RegisterConsumptionDto, registerMinibarConsumption } from '../api';
import { notify } from '../../../lib/notify';

interface ConsumptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    roomId: string; // Strict
    roomNumber: string; // For display
    onSuccess: () => void;
}

export const ConsumptionModal = ({ isOpen, onClose, roomId, roomNumber, onSuccess }: ConsumptionModalProps) => {
    const [formData, setFormData] = useState<Omit<RegisterConsumptionDto, 'roomId'>>({
        productName: '',
        quantity: 1,
        unitPrice: 0
    });
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await registerMinibarConsumption({
                roomId,
                ...formData
            });
            notify.success('Consumo registrado correctamente');
            onSuccess();
            onClose();
            // Reset form
            setFormData({ productName: '', quantity: 1, unitPrice: 0 });
        } catch (error) {
            console.error(error);
            notify.error('Error al registrar consumo');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'productName' ? value : Number(value)
        }));
    };

    const estimatedTotal = formData.quantity * formData.unitPrice;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Registrar Consumo</h2>
                        <p className="text-sm text-gray-500">Habitación {roomNumber}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-black">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
                        <div className="relative">
                            <ShoppingBag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                name="productName"
                                placeholder="Ej. Coca Cola, Pringles..."
                                value={formData.productName}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                            <input
                                type="number"
                                name="quantity"
                                min="1"
                                value={formData.quantity}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Precio Unitario</label>
                            <input
                                type="number"
                                name="unitPrice"
                                min="0"
                                step="0.01"
                                value={formData.unitPrice}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Estimado:</span>
                        <span className="text-lg font-bold text-gray-900">${estimatedTotal.toFixed(2)}</span>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black text-white py-4 rounded-xl font-medium text-lg hover:bg-gray-800 transition-all shadow-md active:scale-[0.98]"
                    >
                        {isLoading ? 'Registrando...' : 'Confirmar Consumo'}
                    </button>
                </form>
            </div>
        </div>
    );
};
