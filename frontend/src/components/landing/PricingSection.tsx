import { Check, X, ArrowRight } from 'lucide-react';

const plans = [
    {
        name: 'Starter',
        description: 'Para negocios pequeños que buscan profesionalizarse.',
        price: '149',
        highlighted: false,
        features: [
            { name: '3 Usuarios incluidos', included: true },
            { name: '1 Punto de venta', included: true },
            { name: '1,000 Transacciones/mes', included: true },
            { name: 'Inventario básico', included: true },
            { name: 'Reportes esenciales', included: true },
            { name: 'Soporte por email', included: true },
            { name: 'Multi-sucursal', included: false },
            { name: 'API Access', included: false },
        ],
        cta: 'Contratar Plan',
        ctaVariant: 'outline',
    },
    {
        name: 'Business',
        description: 'Para negocios en crecimiento que necesitan más poder.',
        price: '349',
        highlighted: true,
        badge: 'MÁS POPULAR',
        features: [
            { name: '10 Usuarios incluidos', included: true },
            { name: '5 Puntos de venta', included: true },
            { name: 'Transacciones ilimitadas', included: true },
            { name: 'Inventario avanzado', included: true },
            { name: 'Reportes completos + BI', included: true },
            { name: 'Soporte prioritario 24/7', included: true },
            { name: '3 Sucursales', included: true },
            { name: 'API Access', included: false },
        ],
        cta: 'Contratar Plan',
        ctaVariant: 'primary',
    },
    {
        name: 'Enterprise',
        description: 'Solución completa para grandes operaciones.',
        price: 'Cotizar',
        highlighted: false,
        isCustom: true,
        features: [
            { name: 'Usuarios ilimitados', included: true },
            { name: 'POS ilimitados', included: true },
            { name: 'Transacciones ilimitadas', included: true },
            { name: 'Inventario + Lotes + Venc.', included: true },
            { name: 'BI Avanzado + Dashboards', included: true },
            { name: 'Account Manager dedicado', included: true },
            { name: 'Sucursales ilimitadas', included: true },
            { name: 'API Access completo', included: true },
        ],
        cta: 'Contactar Ventas',
        ctaVariant: 'outline',
    },
];

export const PricingSection = () => {
    return (
        <section id="precios" className="py-24 bg-gray-950 overflow-hidden transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 mb-4 bg-teal-500/10 px-4 py-2 rounded-full border border-teal-500/20">
                        <span className="text-sm font-medium text-teal-400">
                            💰 Precios Transparentes
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
                        Planes que{' '}
                        <span className="text-teal-400">
                            crecen contigo
                        </span>
                    </h2>
                    <p className="max-w-2xl mx-auto text-gray-300 text-lg">
                        Inversión clara sin sorpresas. Elige el plan que mejor se adapte a tu negocio.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative rounded-2xl p-8 transition-all duration-300 ${plan.highlighted
                                    ? 'bg-gray-800 border-2 border-teal-400 shadow-xl shadow-teal-500/20 scale-[1.02]'
                                    : 'bg-gray-900 border border-gray-700 hover:border-gray-500'
                                }`}
                        >
                            {/* Badge */}
                            {plan.badge && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <span className="bg-teal-400 text-gray-900 text-xs font-bold px-4 py-1.5 rounded-full">
                                        {plan.badge}
                                    </span>
                                </div>
                            )}

                            {/* Plan Header */}
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                                <p className="text-sm text-gray-300">{plan.description}</p>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                {plan.isCustom ? (
                                    <div className="text-3xl font-bold text-white">Precio personalizado</div>
                                ) : (
                                    <div className="flex items-baseline">
                                        <span className="text-sm text-gray-400">S/</span>
                                        <span className="text-5xl font-bold text-white mx-1">{plan.price}</span>
                                        <span className="text-gray-400">/mes</span>
                                    </div>
                                )}
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center">
                                        {feature.included ? (
                                            <Check className="h-5 w-5 text-teal-400 mr-3 flex-shrink-0" />
                                        ) : (
                                            <X className="h-5 w-5 text-gray-600 mr-3 flex-shrink-0" />
                                        )}
                                        <span className={feature.included ? 'text-white' : 'text-gray-500'}>
                                            {feature.name}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            <button
                                className={`w-full py-4 rounded-full font-semibold text-base flex items-center justify-center transition-all ${plan.ctaVariant === 'primary'
                                        ? 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg'
                                        : 'bg-transparent border border-white/30 text-white hover:bg-white/10'
                                    }`}
                            >
                                {plan.cta}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Footer Note */}
                <p className="text-center text-sm text-gray-400 mt-12">
                    Todos los precios en Soles (PEN). Impuestos no incluidos. Facturación anual disponible con descuento.{' '}
                    <a href="#" className="text-teal-400 hover:underline">Ver comparación detallada →</a>
                </p>
            </div>
        </section>
    );
};
