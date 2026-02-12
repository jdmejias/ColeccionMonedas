import { useNavigate } from 'react-router-dom';
import type { Piece } from '../../../shared/types';
import { Card } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button';

interface PieceCardProps {
    piece: Piece;
    onToggleExchange?: (id: string, available: boolean) => void;
    isToggling?: boolean;
}

export const PieceCard = ({ piece, onToggleExchange, isToggling }: PieceCardProps) => {
    const navigate = useNavigate();

    return (
        <Card className="overflow-hidden">
            <div className="relative h-48 bg-gray-200">
                <img
                    src={piece.imageUrl}
                    alt={piece.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src =
                            'https://via.placeholder.com/400x300?text=Sin+Imagen';
                    }}
                />
                {piece.availableForExchange && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Disponible para intercambio
                    </div>
                )}
            </div>

            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                    {piece.name}
                </h3>

                <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <p>
                        <span className="font-medium">Tipo:</span> {piece.type}
                    </p>
                    <p>
                        <span className="font-medium">País:</span> {piece.country}
                    </p>
                    <p>
                        <span className="font-medium">Año:</span> {piece.year}
                    </p>
                    <p>
                        <span className="font-medium">Estado:</span> {piece.conservationState}
                    </p>
                    <p>
                        <span className="font-medium">Valor:</span> ${piece.estimatedValue.toFixed(2)} USD
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate(`/pieces/${piece.id}`)}
                        className="w-full"
                    >
                        Ver Detalle
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/pieces/${piece.id}/edit`)}
                        className="w-full"
                    >
                        Editar
                    </Button>
                    {onToggleExchange && (
                        <Button
                            variant={piece.availableForExchange ? 'danger' : 'ghost'}
                            size="sm"
                            onClick={() => onToggleExchange(piece.id, !piece.availableForExchange)}
                            isLoading={isToggling}
                            className="w-full"
                        >
                            {piece.availableForExchange
                                ? 'Quitar de Intercambio'
                                : 'Marcar para Intercambio'}
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
};
