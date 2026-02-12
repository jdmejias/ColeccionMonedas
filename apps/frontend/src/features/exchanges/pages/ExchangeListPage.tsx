import { useExchanges } from '../hooks/useExchanges';
import { Spinner } from '../../../shared/components/Spinner';
import { Card } from '../../../shared/components/Card';

export const ExchangeListPage = () => {
    const { data: exchanges, isLoading, isError, error } = useExchanges();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner size="lg" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-red-800 font-semibold mb-2">
                    Error al cargar los intercambios
                </h3>
                <p className="text-red-600 text-sm">
                    {error instanceof Error ? error.message : 'Error desconocido'}
                </p>
            </div>
        );
    }

    if (!exchanges || exchanges.length === 0) {
        return (
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Mis Intercambios</h1>
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔄</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No tienes intercambios
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Crea una solicitud de intercambio para comenzar
                    </p>
                </div>
            </div>
        );
    }

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            accepted: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
        };

        const labels = {
            pending: 'Pendiente',
            accepted: 'Aceptado',
            rejected: 'Rechazado',
        };

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${styles[status as keyof typeof styles]}`}>
                {labels[status as keyof typeof labels]}
            </span>
        );
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Intercambios</h1>
            <p className="text-gray-600 mb-8">
                {exchanges.length} {exchanges.length === 1 ? 'intercambio' : 'intercambios'}
            </p>

            <div className="space-y-4">
                {exchanges.map((exchange) => (
                    <Card key={exchange.id}>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Intercambio #{exchange.id}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {new Date(exchange.createdAt).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                                {getStatusBadge(exchange.status)}
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-gray-700">Tu pieza:</span>
                                    <p className="text-gray-900">{exchange.fromPieceId}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Pieza solicitada:</span>
                                    <p className="text-gray-900">{exchange.toPieceId}</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
