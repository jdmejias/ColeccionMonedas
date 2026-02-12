import { useState } from 'react';
import { usePieces, useToggleExchange } from '../hooks/usePieces';
import { PieceCard } from '../components/PieceCard';
import { Spinner } from '../../../shared/components/Spinner';

export const CollectionListPage = () => {
    const { data: pieces, isLoading, isError, error } = usePieces();
    const toggleMutation = useToggleExchange();
    const [togglingId, setTogglingId] = useState<string | null>(null);

    const handleToggleExchange = async (id: string, available: boolean) => {
        setTogglingId(id);
        try {
            await toggleMutation.mutateAsync({ id, available });
        } catch (error) {
            alert('Error al actualizar el estado de intercambio');
            console.error(error);
        } finally {
            setTogglingId(null);
        }
    };

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
                <h3 className="text-red-800 font-semibold mb-2">Error al cargar la colección</h3>
                <p className="text-red-600 text-sm">
                    {error instanceof Error ? error.message : 'Error desconocido'}
                </p>
            </div>
        );
    }

    if (!pieces || pieces.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">🪙</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Tu colección está vacía
                </h3>
                <p className="text-gray-600 mb-4">
                    Comienza agregando tu primera moneda o billete
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Colección</h1>
                <p className="text-gray-600">
                    {pieces.length} {pieces.length === 1 ? 'pieza' : 'piezas'} en tu colección
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {pieces.map((piece) => (
                    <PieceCard
                        key={piece.id}
                        piece={piece}
                        onToggleExchange={handleToggleExchange}
                        isToggling={togglingId === piece.id}
                    />
                ))}
            </div>
        </div>
    );
};
