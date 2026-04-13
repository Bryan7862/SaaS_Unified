import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { notify } from '../lib/notify';
import { Bot, Building2, User, Mail, Lock, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

export function RegisterPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        companyName: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/admin/auth/register', formData);
            notify.success('¡Cuenta creada! Redirigiendo...');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err: any) {
            console.error('Registration failed', err);
            // Notifications are handled globally by the api interceptor in src/lib/api.ts
        } finally {
            setLoading(false);
        }
    };

    const benefits = [
        'Implementación personalizada',
        'Soporte técnico dedicado',
        'Migración de datos incluida',
        'Capacitación para tu equipo',
    ];

    return (
        <div className="min-h-screen flex bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
            {/* Left Panel - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-900 dark:bg-gray-950">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />

                {/* Decorative Circles */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-gray-700/30 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gray-600/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gray-700/20 rounded-full blur-2xl" />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-center w-full px-12">
                    <div className="max-w-md text-center">
                        {/* Logo */}
                        <div className="inline-flex items-center mb-8">
                            <div className="bg-white text-gray-900 p-3 rounded-xl mr-3">
                                <Bot className="h-8 w-8" />
                            </div>
                            <span className="text-3xl font-bold text-white tracking-tight">Nexus ERP</span>
                        </div>

                        <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                            Comience hoy mismo
                        </h2>
                        <p className="text-lg text-gray-400 leading-relaxed mb-10">
                            Únase a cientos de empresas que ya están optimizando sus operaciones con nuestra plataforma.
                        </p>

                        {/* Benefits List */}
                        <div className="space-y-4 text-left">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center">
                                    <CheckCircle className="h-5 w-5 text-teal-400 mr-3 flex-shrink-0" />
                                    <span className="text-gray-300">{benefit}</span>
                                </div>
                            ))}
                        </div>

                        {/* Trust indicators */}
                        <div className="mt-12 pt-8 border-t border-gray-700/50">
                            <p className="text-sm text-gray-500 mb-4">Empresas que confían en nosotros</p>
                            <div className="flex items-center justify-center space-x-6 opacity-50">
                                <div className="w-20 h-8 bg-white/10 rounded" />
                                <div className="w-20 h-8 bg-white/10 rounded" />
                                <div className="w-20 h-8 bg-white/10 rounded" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 flex flex-col">
                {/* Header */}
                <div className="p-6">
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver al inicio
                    </button>
                </div>

                {/* Form Container */}
                <div className="flex-1 flex items-center justify-center px-6 sm:px-12 lg:px-16 py-8">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="lg:hidden flex items-center justify-center mb-8">
                            <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-2.5 rounded-xl mr-2">
                                <Bot className="h-6 w-6" />
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Nexus ERP</span>
                        </div>

                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Crear Cuenta
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400">
                                Complete sus datos para comenzar
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Nombre
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            required
                                            placeholder="Juan"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Apellido
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Pérez"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full px-4 py-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Nombre de la Empresa
                                </label>
                                <div className="relative">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        placeholder="Mi Empresa S.A.C."
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Correo Electrónico
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        placeholder="tu@empresa.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        placeholder="Mínimo 6 caracteres"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex items-start pt-2">
                                <input
                                    type="checkbox"
                                    required
                                    className="w-4 h-4 mt-1 border-gray-300 dark:border-gray-600 rounded text-gray-900 focus:ring-gray-900 dark:focus:ring-white"
                                />
                                <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                                    Acepto los{' '}
                                    <a href="#" className="font-medium text-gray-900 dark:text-white hover:underline">
                                        Términos de Servicio
                                    </a>{' '}
                                    y la{' '}
                                    <a href="#" className="font-medium text-gray-900 dark:text-white hover:underline">
                                        Política de Privacidad
                                    </a>
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="group w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-full font-semibold text-base hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-6"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creando cuenta...
                                    </span>
                                ) : (
                                    <>
                                        Crear Cuenta
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-gray-600 dark:text-gray-400">
                            ¿Ya tienes una cuenta?{' '}
                            <Link
                                to="/login"
                                className="font-semibold text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                Inicia sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
