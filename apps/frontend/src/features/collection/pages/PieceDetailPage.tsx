import { useParams, useNavigate } from 'react-router-dom';
import { usePiece, useToggleExchange } from '../hooks/usePieces';
import { Button } from '../../../shared/components/Button';
import { Spinner } from '../../../shared/components/Spinner';

export const PieceDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: piece, isLoading, isError, error } = usePiece(id!);
    const toggleMutation = useToggleExchange();

    const handleToggleExchange = async () => {
        if (!piece) return;

        try {
            await toggleMutation.mutateAsync({
                id: piece.id,
                available: !piece.availableForExchange,
            });
        } catch (error) {
            alert('Error al actualizar el estado de intercambio');
            console.error(error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner size="lg" />
            </div>
        );
    }

    if (isError || !piece) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-red-800 font-semibold mb-2">Error al cargar la pieza</h3>
                <p className="text-red-600 text-sm">
                    {error instanceof Error ? error.message : 'Pieza no encontrada'}
                </p>
                <Button variant="secondary" className="mt-4" onClick={() => navigate('/')}>
                    Volver a la colección
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="mb-4"
            >
                ← Volver a la colección
            </Button>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/2">
                        <img
                            src={piece.imageUrl}
                            alt={piece.name}
                            className="w-full h-96 object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                    'https://via.placeholder.com/600x400?text=Sin+Imagen';
                            }}
                        />
                    </div>

                    <div className="md:w-1/2 p-8">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{piece.name}</h1>
                            {piece.availableForExchange && (
                                <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    Disponible para intercambio
                                </span>
                            )}
                        </div>

                        <div className="space-y-4 mb-8">
                            <div>
                                <span className="text-sm font-semibold text-gray-500 uppercase">Tipo</span>
                                <p className="text-lg text-gray-900">{piece.type}</p>
                            </div>

                            <div>
                                <span className="text-sm font-semibold text-gray-500 uppercase">País</span>
                                <p className="text-lg text-gray-900">{piece.country}</p>
                            </div>

                            <div>
                                <span className="text-sm font-semibold text-gray-500 uppercase">Año</span>
                                <p className="text-lg text-gray-900">{piece.year}</p>
                            </div>

                            <div>
                                <span className="text-sm font-semibold text-gray-500 uppercase">
                                    Estado de Conservación
                                </span>
                                <p className="text-lg text-gray-900">{piece.conservationState}</p>
                            </div>

                            <div>
                                <span className="text-sm font-semibold text-gray-500 uppercase">
                                    Valor Estimado
                                </span>
                                <p className="text-lg text-gray-900">${piece.estimatedValue.toFixed(2)} USD</p>
                            </div>

                            {piece.description && (
                                <div>
                                    <span className="text-sm font-semibold text-gray-500 uppercase">
                                        Descripción
                                    </span>
                                    <p className="text-gray-700 mt-1">{piece.description}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button
                                variant="primary"
                                onClick={() => navigate(`/pieces/${piece.id}/edit`)}
                                className="w-full"
                            >
                                Editar Pieza
                            </Button>
                            <Button
                                variant={piece.availableForExchange ? 'danger' : 'secondary'}
                                onClick={handleToggleExchange}
                                isLoading={toggleMutation.isPending}
                                className="w-full"
                            >
                                {piece.availableForExchange
                                    ? 'Quitar de Intercambio'
                                    : 'Marcar para Intercambio'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
