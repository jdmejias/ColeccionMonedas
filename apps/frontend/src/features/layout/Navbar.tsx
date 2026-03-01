import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export const Navbar = () => {
    const { user, isOwner, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const navLinks = [
        { to: '/', label: 'Colección', show: true },
        { to: '/top', label: 'Top 5', show: true },
        { to: '/exchanges', label: 'Intercambios', show: true },
        { to: '/exchanges/history', label: 'Historial', show: isOwner },
        { to: '/pieces/new', label: 'Agregar', show: isOwner },
        { to: '/exchanges/new', label: 'Solicitar', show: !isOwner },
        { to: '/profile', label: 'Perfil', show: true },
    ].filter(l => l.show);

    const isActive = (to: string) =>
        to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white/95 backdrop-blur-md border-b border-amber-100 sticky top-0 z-40 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2.5 group">
                            <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-lg shadow-sm group-hover:shadow-gold transition-shadow">
                                🪙
                            </div>
                            <div className="hidden sm:block">
                                <span className="font-display text-lg font-bold text-gray-900">NumisColección</span>
                                {isOwner && (
                                    <span className="ml-2 badge badge-gold text-[10px]">Admin</span>
                                )}
                            </div>
                        </Link>
                    </div>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                    isActive(link.to)
                                        ? 'bg-primary-50 text-primary-700 shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* User + Logout */}
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                            <div className="w-7 h-7 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {user?.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-xs">
                                <p className="font-semibold text-gray-800 leading-tight">{user?.name}</p>
                                <p className="text-gray-400 leading-tight">{isOwner ? 'Propietario' : 'Visitante'}</p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-gray-200"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Salir
                        </button>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileOpen
                                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                }
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div className="md:hidden border-t border-gray-100 py-3 space-y-1 animate-fade-in">
                        {navLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setMobileOpen(false)}
                                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                    isActive(link.to)
                                        ? 'bg-primary-50 text-primary-700'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                            🚪 Cerrar sesión
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

