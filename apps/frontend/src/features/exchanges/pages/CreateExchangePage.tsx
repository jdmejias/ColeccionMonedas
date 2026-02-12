import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePieces } from '../../collection/hooks/usePieces';
import { useCreateExchange } from '../hooks/useExchanges';
import { Select } from '../../../shared/components/Select';
import { Button } from '../../../shared/components/Button';
import { Spinner } from '../../../shared/components/Spinner';
import { Card } from '../../../shared/components/Card';
import type { Piece } from '../../../shared/types';

export const CreateExchangePage = () => {
    const navigate = useNavigate();
    const { data: pieces, isLoading } = usePieces();
    const createExchangeMutation = useCreateExchange();

    const [fromPieceId, setFromPieceId] = useState('');
    const [toPieceId, setToPieceId] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Mock user ID for demonstration
    const MOCK_TO_USER_ID = 'user-2';

    const myPieces = pieces || [];
    const availablePieces = pieces?.filter((p) => p.availableForExchange) || [];

    const selectedFromPiece = myPieces.find((p) => p.id === fromPieceId);
    const selectedToPiece = availablePieces.find((p) => p.id === toPieceId);

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!fromPieceId) {
            newErrors.fromPieceId = 'Debes seleccionar una pieza de tu colección';
        }
        if (!toPieceId) {
            newErrors.toPieceId = 'Debes seleccionar una pieza para intercambiar';
        }
        if (fromPieceId === toPieceId) {
            newErrors.toPieceId = 'No puedes intercambiar la misma pieza';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            await createExchangeMutation.mutateAsync({
                fromPieceId,
                toPieceId,
                toUserId: MOCK_TO_USER_ID,
            });

            alert('¡Solicitud de intercambio creada exitosamente!');
            navigate('/exchanges');
        } catch (error) {
            alert('Error al crear la solicitud de intercambio');
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

    const PiecePreview = ({ piece, title }: { piece?: Piece; title: string }) => {
        if (!piece) {
            return (
                <Card className="bg-gray-50 border-2 border-dashed border-gray-300">
                    <div className="p-8 text-center text-gray-500">
                        {title}
                    </div>
                </Card>
            );
        }

        return (
            <Card>
                <div className="h-32 bg-gray-200">
                    <img
                        src={piece.imageUrl}
                        alt={piece.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src =
                                'https://via.placeholder.com/400x200?text=Sin+Imagen';
                        }}
                    />
                </div>
                <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{piece.name}</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                        <p>País: {piece.country}</p>
                        <p>Año: {piece.year}</p>
                        <p>Valor: ${piece.estimatedValue.toFixed(2)} USD</p>
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Solicitar Intercambio
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Selecciona las piezas
                    </h2>

                    <div className="space-y-6">
                        <Select
                            id="fromPieceId"
                            label="Tu pieza"
                            value={fromPieceId}
                            onChange={(e) => {
                                setFromPieceId(e.target.value);
                                setErrors({ ...errors, fromPieceId: '' });
                            }}
                            options={myPieces.map((p) => ({
                                value: p.id,
                                label: `${p.name} (${p.country}, ${p.year})`,
                            }))}
                            error={errors.fromPieceId}
                            required
                        />

                        <Select
                            id="toPieceId"
                            label="Pieza que deseas"
                            value={toPieceId}
                            onChange={(e) => {
                                setToPieceId(e.target.value);
                                setErrors({ ...errors, toPieceId: '' });
                            }}
                            options={availablePieces.map((p) => ({
                                value: p.id,
                                label: `${p.name} (${p.country}, ${p.year})`,
                            }))}
                            error={errors.toPieceId}
                            required
                        />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Vista Previa del Intercambio
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Ofreces:</h3>
                            <PiecePreview piece={selectedFromPiece} title="Selecciona tu pieza" />
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Recibes:</h3>
                            <PiecePreview piece={selectedToPiece} title="Selecciona pieza deseada" />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={createExchangeMutation.isPending}
                        className="flex-1"
                    >
                        Enviar Solicitud
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate('/exchanges')}
                        disabled={createExchangeMutation.isPending}
                    >
                        Cancelar
                    </Button>
                </div>
            </form>
        </div>
    );
};
