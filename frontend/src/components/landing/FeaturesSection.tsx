import { TrendingUp, Zap, Cloud, Shield, Clock, BarChart3 } from 'lucide-react';

const features = [
    {
        icon: TrendingUp,
        title: "Analítica en Tiempo Real",
        desc: "Dashboards actualizados al segundo con KPIs críticos, tendencias de ventas y alertas inteligentes.",
    },
    {
        icon: Zap,
        title: "Automatización",
        desc: "Facturación automática, recordatorios de pago, reportes programados y workflows personalizables.",
    },
    {
        icon: Cloud,
        title: "100% en la Nube",
        desc: "Accede desde cualquier dispositivo, en cualquier lugar. Sin instalaciones ni servidores que mantener.",
    },
    {
        icon: Shield,
        title: "Seguridad Bancaria",
        desc: "Encriptación SSL, backups automáticos, autenticación 2FA y cumplimiento con estándares internacionales.",
    },
    {
        icon: Clock,
        title: "Soporte 24/7",
        desc: "Equipo de expertos disponible por chat, email o teléfono. Tiempo de respuesta promedio: 15 minutos.",
    },
    {
        icon: BarChart3,
        title: "Reportes Avanzados",
        desc: "Más de 50 reportes personalizables. Exporta a Excel, PDF o conecta con sistemas externos.",
    },
];

export const FeaturesSection = () => {
    return (
        <section id="beneficios" className="py-24 bg-gray-950 overflow-hidden transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 mb-4 bg-gray-800 px-4 py-2 rounded-full border border-gray-700">
                        <span className="text-sm font-medium text-white">
                            ⚡ Características Clave
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
                        Todo lo que necesitas para{' '}
                        <span className="text-teal-400">
                            crecer
                        </span>
                    </h2>
                    <p className="max-w-2xl mx-auto text-gray-300 text-lg">
                        Herramientas poderosas diseñadas para simplificar las operaciones y potenciar el crecimiento de tu negocio.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-gray-600 transition-all duration-300 group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center mb-5 group-hover:bg-gray-700 transition-colors">
                                <feature.icon className="h-6 w-6 text-white" />
                            </div>

                            <h3 className="text-lg font-bold text-white mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
