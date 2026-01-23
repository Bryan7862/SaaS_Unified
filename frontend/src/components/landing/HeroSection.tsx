import { ArrowRight, Play, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HeroSection = () => {
    const navigate = useNavigate();

    const trustCompanies = ['Gimnasio Power', 'Retail Plus', 'Café Central', 'Hotel Vista', 'Farmacia Salud', 'Tienda Express'];

    return (
        <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-gray-950">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left Content */}
                    <div>
                        {/* Badge */}
                        <div className="inline-flex items-center space-x-2 mb-6 bg-teal-500/10 border border-teal-500/20 px-4 py-2 rounded-full">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400"></span>
                            </span>
                            <span className="text-sm font-medium text-teal-400">
                                Sistema ERP Todo en Uno
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
                            Gestiona tu negocio con{' '}
                            <span className="text-teal-400">
                                precisión absoluta
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-lg">
                            La suite ERP modular que se adapta a tu industria. Inventario,
                            ventas, clientes y reportes — todo centralizado en una plataforma intuitiva.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                            <button
                                onClick={() => navigate('/register')}
                                className="group bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-base hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
                            >
                                Registrarse
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                className="group px-8 py-4 rounded-full font-semibold text-base border border-white/30 text-white hover:bg-white/10 transition-all flex items-center justify-center"
                            >
                                <Play className="mr-2 h-5 w-5 fill-current" />
                                Ver Demo
                            </button>
                            {/* Stats Badge */}
                            <div className="hidden sm:flex bg-white rounded-xl px-4 py-3 shadow-lg items-center gap-2">
                                <div>
                                    <div className="text-xs text-gray-500">Crecimiento</div>
                                    <div className="text-lg font-bold text-gray-900">+124% 📈</div>
                                </div>
                            </div>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                            {['Implementación en 48h', 'Soporte dedicado', 'Migración incluida'].map((item, i) => (
                                <div key={i} className="flex items-center text-sm text-white/80">
                                    <CheckCircle className="h-4 w-4 text-teal-400 mr-2" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right - Dashboard Mockup */}
                    <div className="relative">
                        {/* Floating Notification */}
                        <div className="absolute -top-4 right-0 lg:right-4 z-20 bg-white rounded-xl p-3 shadow-xl flex items-center gap-3">
                            <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-gray-900">Nueva Venta</div>
                                <div className="text-xs text-gray-500">S/ 250.00 · hace 2 min</div>
                            </div>
                        </div>

                        {/* Dashboard Card */}
                        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
                            {/* Browser Header */}
                            <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center px-4">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <div className="flex-1 flex justify-center">
                                    <div className="bg-gray-700 rounded px-3 py-1 text-xs text-gray-300">
                                        app.nexuserp.com/dashboard
                                    </div>
                                </div>
                            </div>

                            {/* Dashboard Content */}
                            <div className="p-5">
                                {/* Stats Row */}
                                <div className="grid grid-cols-3 gap-4 mb-5">
                                    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-gray-400">💰</span>
                                            <span className="text-xs font-medium text-teal-400">+12%</span>
                                        </div>
                                        <div className="text-xl font-bold text-white">S/ 45,231</div>
                                        <div className="text-xs text-gray-400">Ventas del Mes</div>
                                    </div>
                                    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-gray-400">👥</span>
                                            <span className="text-xs font-medium text-teal-400">+8%</span>
                                        </div>
                                        <div className="text-xl font-bold text-white">1,847</div>
                                        <div className="text-xs text-gray-400">Clientes Activos</div>
                                    </div>
                                    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-gray-400">📈</span>
                                            <span className="text-xs font-medium text-teal-400">+24%</span>
                                        </div>
                                        <div className="text-xl font-bold text-white">89.2%</div>
                                        <div className="text-xs text-gray-400">Conversión</div>
                                    </div>
                                </div>

                                {/* Chart */}
                                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-semibold text-white">Rendimiento Semanal</span>
                                        <div className="text-xs text-gray-400">📊</div>
                                    </div>
                                    <div className="flex items-end gap-2 h-24">
                                        {[35, 55, 45, 70, 50, 85, 65].map((h, i) => (
                                            <div key={i} className="flex-1 flex flex-col items-center">
                                                <div
                                                    className="w-full bg-gradient-to-t from-teal-500 to-teal-400 rounded-t"
                                                    style={{ height: `${h}%` }}
                                                ></div>
                                                <span className="text-[10px] text-gray-400 mt-2">
                                                    {['L', 'M', 'X', 'J', 'V', 'S', 'D'][i]}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Bottom Row */}
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="bg-gray-800 rounded-xl p-3 border border-gray-700">
                                        <div className="text-xs text-gray-400">Crecimiento Mensual</div>
                                        <div className="text-lg font-bold text-teal-400">+124% 📈</div>
                                    </div>
                                    <button className="bg-white text-gray-900 rounded-xl p-3 text-sm font-semibold hover:bg-gray-100 transition-colors text-center">
                                        Ver Reportes
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Trust Companies */}
                <div className="mt-20 pt-12 border-t border-gray-800">
                    <p className="text-center text-sm text-gray-400 mb-8 uppercase tracking-wider">
                        Empresas que confían en nosotros
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
                        {trustCompanies.map((company, i) => (
                            <span key={i} className="text-white/60 font-medium hover:text-white transition-colors cursor-default">
                                {company}
                            </span>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="flex justify-center items-center gap-12 mt-12">
                        {[
                            { value: '500+', label: 'Empresas Activas' },
                            { value: '99.9%', label: 'Uptime Garantizado' },
                            { value: '2M+', label: 'Transacciones/Mes' },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-3xl font-bold text-white">{stat.value}</div>
                                <div className="text-sm text-gray-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
