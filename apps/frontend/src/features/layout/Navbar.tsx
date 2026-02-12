import { Link } from 'react-router-dom';

export const Navbar = () => {
    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <span className="text-2xl font-bold text-primary-600">💰</span>
                            <span className="ml-2 text-xl font-semibold text-gray-900">
                                Colección de Monedas
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link
                            to="/"
                            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                        >
                            Mi Colección
                        </Link>
                        <Link
                            to="/pieces/new"
                            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                        >
                            Agregar Pieza
                        </Link>
                        <Link
                            to="/exchanges"
                            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                        >
                            Intercambios
                        </Link>
                        <Link
                            to="/exchanges/new"
                            className="px-3 py-2 rounded-md text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                        >
                            Solicitar Intercambio
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};
