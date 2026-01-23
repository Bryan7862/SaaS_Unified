import { useNavigate } from 'react-router-dom';
import { Bot, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export const LandingNavbar = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Soluciones', href: '#soluciones' },
        { name: 'Beneficios', href: '#beneficios' },
        { name: 'Precios', href: '#precios' },
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled
            ? 'bg-gray-950/95 backdrop-blur-lg border-b border-gray-800'
            : 'bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <div
                        className="flex items-center cursor-pointer group"
                        onClick={() => navigate('/')}
                    >
                        <div className="bg-white text-gray-900 p-2 rounded-xl mr-2.5 group-hover:scale-105 transition-transform">
                            <Bot className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">
                            Nexus ERP
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link, i) => (
                            <a
                                key={i}
                                href={link.href}
                                className="px-4 py-2 text-gray-300 hover:text-white font-medium transition-colors rounded-lg hover:bg-gray-800"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-5 py-2.5 text-white font-medium hover:text-teal-400 transition-colors"
                        >
                            Iniciar Sesión
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="bg-white text-gray-900 px-6 py-2.5 rounded-full font-semibold hover:bg-gray-100 transition-all shadow-md hover:shadow-lg"
                        >
                            Registrarse
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-gray-950 border-t border-gray-800 shadow-xl">
                    <div className="flex flex-col space-y-2 px-6 py-6">
                        {navLinks.map((link, i) => (
                            <a
                                key={i}
                                href={link.href}
                                className="py-3 px-4 text-lg font-medium text-white hover:bg-gray-800 rounded-xl transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.name}
                            </a>
                        ))}

                        <hr className="border-gray-800 my-2" />

                        <button
                            onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
                            className="py-3 px-4 text-lg font-medium text-white text-left hover:bg-gray-800 rounded-xl transition-colors"
                        >
                            Iniciar Sesión
                        </button>
                        <button
                            onClick={() => { navigate('/register'); setIsMenuOpen(false); }}
                            className="mt-2 bg-white text-gray-900 px-6 py-4 rounded-full font-semibold text-center shadow-md"
                        >
                            Registrarse
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};
