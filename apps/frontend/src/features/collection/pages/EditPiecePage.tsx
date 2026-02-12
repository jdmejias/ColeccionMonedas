import { useParams } from 'react-router-dom';
import { usePiece } from '../hooks/usePieces';
import { PieceForm } from '../components/PieceForm';
import { Spinner } from '../../../shared/components/Spinner';

export const EditPiecePage = () => {
    const { id } = useParams<{ id: string }>();
    const { data: piece, isLoading, isError } = usePiece(id!);

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
                <h3 className="text-red-800 font-semibold">Pieza no encontrada</h3>
            </div>
        );
    }

    return <PieceForm piece={piece} mode="edit" />;
};
