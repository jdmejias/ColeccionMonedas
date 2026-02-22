import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';

export const LoginPage = () => {
    const { login, loginAsVisitor } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState<'owner' | 'visitor'>('visitor');

    // Owner form
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [ownerError, setOwnerError] = useState('');
    const [ownerLoading, setOwnerLoading] = useState(false);

    // Visitor form
    const [visitorName, setVisitorName] = useState('');
    const [visitorEmail, setVisitorEmail] = useState('');
    const [visitorErrors, setVisitorErrors] = useState<Record<string, string>>({});

    const handleOwnerLogin = async (e: FormEvent) => {
        e.preventDefault();
        setOwnerError('');
        setOwnerLoading(true);
        const ok = await login(email, password);
        setOwnerLoading(false);
        if (!ok) {
            setOwnerError('Correo o contraseña incorrectos.');
        } else {
            navigate('/');
        }
    };

    const handleVisitorLogin = (e: FormEvent) => {
        e.preventDefault();
        const errs: Record<string, string> = {};
        if (!visitorName.trim()) errs.name = 'Ingresa tu nombre';
        if (!visitorEmail.trim()) errs.email = 'Ingresa tu correo';
        else if (!/\S+@\S+\.\S+/.test(visitorEmail)) errs.email = 'Correo inválido';
        if (Object.keys(errs).length > 0) { setVisitorErrors(errs); return; }
        loginAsVisitor(visitorName.trim(), visitorEmail.trim());
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-900 via-yellow-800 to-amber-700 flex items-center justify-center p-4">
            {/* Decorative circles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-yellow-400/10 blur-3xl" />
                <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-amber-300/10 blur-3xl" />
                <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full border border-yellow-300/10" />
                <div className="absolute top-1/4 right-1/4 w-40 h-40 rounded-full border border-yellow-300/10" />
            </div>

            <div className="relative w-full max-w-md animate-fade-in">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full shadow-gold mb-4">
                        <span className="text-4xl">🪙</span>
                    </div>
                    <h1 className="font-display text-4xl font-bold text-white drop-shadow mb-1">
                        NumisColección
                    </h1>
                    <p className="text-yellow-200/80 text-sm">
                        El hogar de tu colección de monedas y billetes
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Tab switcher */}
                    <div className="flex border-b border-gray-100">
                        <button
                            onClick={() => setTab('visitor')}
                            className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                                tab === 'visitor'
                                    ? 'text-primary-700 border-b-2 border-primary-500 bg-primary-50'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            👀 Explorar colección
                        </button>
                        <button
                            onClick={() => setTab('owner')}
                            className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                                tab === 'owner'
                                    ? 'text-primary-700 border-b-2 border-primary-500 bg-primary-50'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            🔑 Coleccionista
                        </button>
                    </div>

                    <div className="p-8">
                        {tab === 'visitor' ? (
                            <form onSubmit={handleVisitorLogin} className="space-y-5">
                                <div>
                                    <h2 className="font-display text-2xl font-bold text-gray-900 mb-1">
                                        ¡Bienvenido!
                                    </h2>
                                    <p className="text-gray-500 text-sm mb-6">
                                        Explora la colección y solicita intercambios
                                    </p>
                                </div>

                                <Input
                                    id="visitorName"
                                    label="Tu nombre"
                                    type="text"
                                    placeholder="Ej. Carlos Mendoza"
                                    value={visitorName}
                                    onChange={e => { setVisitorName(e.target.value); setVisitorErrors({...visitorErrors, name: ''}); }}
                                    error={visitorErrors.name}
                                    required
                                />
                                <Input
                                    id="visitorEmail"
                                    label="Tu correo electrónico"
                                    type="email"
                                    placeholder="correo@ejemplo.com"
                                    value={visitorEmail}
                                    onChange={e => { setVisitorEmail(e.target.value); setVisitorErrors({...visitorErrors, email: ''}); }}
                                    error={visitorErrors.email}
                                    required
                                />

                                <Button type="submit" variant="primary" size="lg" className="w-full mt-2">
                                    Explorar Colección →
                                </Button>

                                <p className="text-center text-xs text-gray-400">
                                    Podrás ver todas las piezas y solicitar intercambios
                                </p>
                            </form>
                        ) : (
                            <form onSubmit={handleOwnerLogin} className="space-y-5">
                                <div>
                                    <h2 className="font-display text-2xl font-bold text-gray-900 mb-1">
                                        Acceso Propietario
                                    </h2>
                                    <p className="text-gray-500 text-sm mb-6">
                                        Gestiona tu colección completa
                                    </p>
                                </div>

                                <Input
                                    id="email"
                                    label="Correo electrónico"
                                    type="email"
                                    placeholder="admin@coleccion.com"
                                    value={email}
                                    onChange={e => { setEmail(e.target.value); setOwnerError(''); }}
                                    required
                                />
                                <Input
                                    id="password"
                                    label="Contraseña"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => { setPassword(e.target.value); setOwnerError(''); }}
                                    required
                                />

                                {ownerError && (
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                                        {ownerError}
                                    </div>
                                )}

                                <Button type="submit" variant="primary" size="lg" isLoading={ownerLoading} className="w-full mt-2">
                                    Iniciar Sesión
                                </Button>

                                <p className="text-center text-xs text-gray-400">
                                    Demo: admin@coleccion.com / admin123
                                </p>
                            </form>
                        )}
                    </div>
                </div>

                <p className="text-center text-yellow-200/60 text-xs mt-6">
                    Sistema de Gestión Numismática
                </p>
            </div>
        </div>
    );
};
