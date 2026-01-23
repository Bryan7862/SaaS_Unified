import { Dumbbell, Store, Utensils, Building, Pill, Truck, ArrowRight } from 'lucide-react';

const niches = [
    {
        icon: Dumbbell,
        title: "Gimnasios & Fitness",
        description: "Control de accesos biométrico, membresías flexibles, reserva de clases y seguimiento de entrenadores.",
        color: "bg-orange-500",
        tags: ["Control de acceso", "Membresías", "Clases grupales"],
    },
    {
        icon: Store,
        title: "Retail & POS",
        description: "Punto de venta ultra rápido, inventario en tiempo real, códigos de barras y reportes detallados.",
        color: "bg-cyan-500",
        tags: ["Multi caja", "Inventario", "Facturación"],
    },
    {
        icon: Utensils,
        title: "Restaurantes",
        description: "Gestión de mesas, comandas digitales, control de recetas y sistema de delivery integrado.",
        color: "bg-rose-500",
        tags: ["Mesas", "Cocina", "Delivery"],
    },
    {
        icon: Building,
        title: "Hoteles",
        description: "Reservas online, gestión de habitaciones, housekeeping y facturación automatizada.",
        color: "bg-green-500",
        tags: ["Reservas", "Check-in", "Housekeeping"],
    },
    {
        icon: Pill,
        title: "Farmacias",
        description: "Control de lotes, fechas de vencimiento, recetas médicas y alertas de stock bajo.",
        color: "bg-purple-500",
        tags: ["Recetas", "Lotes", "Vencimientos"],
    },
    {
        icon: Truck,
        title: "Distribuidoras",
        description: "Rutas de entrega, gestión de flotas, pedidos mayoristas y seguimiento GPS.",
        color: "bg-yellow-500",
        tags: ["Rutas", "Flotas", "Mayoreo"],
    },
];

export const NichesSection = () => {
    return (
        <section id="soluciones" className="py-24 bg-gray-900 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 mb-4 bg-gray-800 px-4 py-2 rounded-full border border-gray-700">
                        <span className="text-sm font-medium text-white">
                            🎯 Soluciones por Industria
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
                        Un sistema,{' '}
                        <span className="text-teal-400">
                            múltiples industrias
                        </span>
                    </h2>
                    <p className="max-w-2xl mx-auto text-gray-300 text-lg">
                        Módulos especializados que se adaptan a las necesidades únicas de tu negocio,
                        sin la complejidad de sistemas genéricos.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {niches.map((niche, index) => (
                        <div
                            key={index}
                            className="group bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-gray-500 hover:bg-gray-750 transition-all duration-300"
                        >
                            {/* Icon */}
                            <div className={`w-12 h-12 ${niche.color} rounded-xl flex items-center justify-center mb-5`}>
                                <niche.icon className="h-6 w-6 text-white" />
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold text-white mb-2">{niche.title}</h3>
                            <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                {niche.description}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {niche.tags.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 text-xs font-medium bg-gray-700 text-white rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Link */}
                            <a
                                href="#"
                                className="inline-flex items-center text-sm font-semibold text-white hover:text-teal-400 transition-colors"
                            >
                                Explorar módulo
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
