import { useNavigate } from 'react-router-dom';
import { ArrowRight, MessageCircle, CheckCircle } from 'lucide-react';

export const CTASection = () => {
    const navigate = useNavigate();

    const benefits = [
        'Implementación personalizada',
        'Migración de datos incluida',
        'Soporte técnico dedicado',
        'Capacitación para tu equipo',
    ];

    return (
        <section className="py-24 bg-gray-900 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Content */}
                <div className="text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center space-x-2 mb-6 bg-teal-500/10 border border-teal-500/20 px-4 py-2 rounded-full">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400"></span>
                        </span>
                        <span className="text-sm font-medium text-teal-400">
                            +500 empresas ya confían en nosotros
                        </span>
                    </div>

                    {/* Headline */}
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
                        ¿Listo para transformar tu negocio?
                    </h2>

                    <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Únete a las empresas que ya optimizan sus operaciones diarias con Nexus ERP.
                        Agenda una demo personalizada con nuestro equipo.
                    </p>

                    {/* Benefits */}
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-10">
                        {benefits.map((benefit, i) => (
                            <div key={i} className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-teal-400 mr-2" />
                                <span className="text-white text-sm">{benefit}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/register')}
                            className="group w-full sm:w-auto bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-base hover:bg-gray-100 transition-all shadow-lg flex items-center justify-center"
                        >
                            Registrarse
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-base border border-white/30 text-white hover:bg-white/10 transition-all flex items-center justify-center"
                        >
                            <MessageCircle className="mr-2 h-5 w-5" />
                            Hablar con Ventas
                        </button>
                    </div>

                    {/* Small Print */}
                    <p className="mt-8 text-sm text-gray-400">
                        Precios personalizados según el tamaño de tu empresa. Contáctanos para una cotización.
                    </p>
                </div>
            </div>
        </section>
    );
};
