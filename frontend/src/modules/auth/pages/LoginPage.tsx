import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../../lib/api';
import { notify } from '../../../lib/notify';
import { Bot, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/admin/auth/login', {
                email,
                password,
            });

            console.log('Login success:', response.data);
            const token = response.data.access_token;
            localStorage.setItem('access_token', token);

            // Fetch User Profile to get Default Context
            try {
                const profileResponse = await api.get('/admin/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const { defaultCompanyId } = profileResponse.data;
                if (defaultCompanyId) {
                    localStorage.setItem('current_company_id', defaultCompanyId);
                } else {
                    console.warn('User has no default company tied to account');
                }
            } catch (profileErr) {
                console.error('Failed to fetch profile context', profileErr);
            }

            // Auto-redirect to dashboard
            navigate('/dashboard');
        } catch (err: any) {
            console.error('Login failed:', err);
            if (err.response?.status === 401) {
                notify.error('Credenciales incorrectas. Verifica tu email y contraseña.');
            } else if (!err.response) {
                notify.error('Error de conexión.');
            } else {
                notify.error(err.response?.data?.message || 'Error al iniciar sesión');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
            {/* Left Panel - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-900 dark:bg-gray-950">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />

                {/* Decorative Circles */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-gray-700/30 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gray-600/20 rounded-full blur-3xl" />

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
                            Bienvenido de nuevo
                        </h2>
                        <p className="text-lg text-gray-400 leading-relaxed">
                            Accede a tu panel de control y continúa gestionando tu negocio con la eficiencia que mereces.
                        </p>

                        {/* Trust indicators */}
                        <div className="mt-12 flex items-center justify-center space-x-8">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">+500</div>
                                <div className="text-sm text-gray-500">Empresas</div>
                            </div>
                            <div className="w-px h-12 bg-gray-700" />
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">99.9%</div>
                                <div className="text-sm text-gray-500">Uptime</div>
                            </div>
                            <div className="w-px h-12 bg-gray-700" />
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">24/7</div>
                                <div className="text-sm text-gray-500">Soporte</div>
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
                <div className="flex-1 flex items-center justify-center px-6 sm:px-12 lg:px-16">
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
                                Iniciar Sesión
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400">
                                Ingresa tus credenciales para continuar
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Correo Electrónico
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="tu@empresa.com"
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
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 border-gray-300 dark:border-gray-600 rounded text-gray-900 focus:ring-gray-900 dark:focus:ring-white"
                                    />
                                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                        Recordarme
                                    </span>
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="group w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-full font-semibold text-base hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Iniciando sesión...
                                    </span>
                                ) : (
                                    <>
                                        Iniciar Sesión
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-gray-600 dark:text-gray-400">
                            ¿No tienes una cuenta?{' '}
                            <Link
                                to="/register"
                                className="font-semibold text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                Regístrate gratis
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
