import { useTopPieces } from '../hooks/usePieces';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '../../../shared/components/Spinner';

const MEDAL_EMOJI = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
const MEDAL_COLORS = [
    'from-yellow-400 to-amber-500',
    'from-gray-300 to-gray-400',
    'from-orange-400 to-amber-600',
    'from-primary-200 to-primary-300',
    'from-primary-100 to-primary-200',
];
const RANK_BADGE = [
    'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-gold',
    'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800',
    'bg-gradient-to-r from-orange-400 to-amber-600 text-white',
    'bg-primary-100 text-primary-700',
    'bg-primary-50 text-primary-600',
];

export const TopCollectionPage = () => {
    const { data: pieces, isLoading } = useTopPieces(5);
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="animate-slide-up">
            {/* Hero */}
            <div className="page-hero relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-16 text-8xl rotate-12">🏆</div>
                    <div className="absolute -bottom-4 left-8 text-6xl -rotate-12">🪙</div>
                </div>
                <div className="relative">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-4xl">🏆</span>
                        <h1 className="font-display text-4xl font-bold">Top 5 de la Colección</h1>
                    </div>
                    <p className="text-primary-100 text-lg">
                        Las piezas más valiosas de NumisColección
                    </p>
                </div>
            </div>

            {/* Ranking */}
            <div className="space-y-4">
                {(pieces ?? []).map((piece, index) => (
                    <div
                        key={piece.id}
                        onClick={() => navigate(`/pieces/${piece.id}`)}
                        className={`bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer overflow-hidden border ${
                            index === 0 ? 'border-yellow-300 ring-2 ring-yellow-200' : 'border-gray-100'
                        } animate-slide-up`}
                        style={{ animationDelay: `${index * 80}ms` }}
                    >
                        <div className="flex items-stretch">
                            {/* Rank */}
                            <div className={`bg-gradient-to-b ${MEDAL_COLORS[index]} flex flex-col items-center justify-center px-5 min-w-[80px]`}>
                                <span className="text-3xl">{MEDAL_EMOJI[index]}</span>
                                <span className="text-white font-bold text-sm mt-1">#{index + 1}</span>
                            </div>

                            {/* Image */}
                            <div className="w-28 flex-shrink-0">
                                <img
                                    src={piece.imageUrl}
                                    alt={piece.name}
                                    className="w-full h-full object-cover"
                                    onError={e => {
                                        (e.target as HTMLImageElement).src =
                                            'https://via.placeholder.com/200x150?text=Pieza';
                                    }}
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <span className={`badge text-xs px-2.5 py-0.5 rounded-full font-bold ${RANK_BADGE[index]}`}>
                                            {index === 0 ? 'Pieza Reina' : index === 1 ? 'Plata' : index === 2 ? 'Bronce' : `#${index + 1}`}
                                        </span>
                                        <span className="badge badge-gold">{piece.type}</span>
                                        {piece.availableForExchange && (
                                            <span className="badge badge-green">🔄 Intercambio</span>
                                        )}
                                    </div>
                                    <h3 className="font-display text-lg font-bold text-gray-900 mb-1">{piece.name}</h3>
                                    <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                                        <span>🌍 {piece.country}</span>
                                        <span>📅 {piece.year}</span>
                                        <span>⭐ {piece.conservationState}</span>
                                    </div>
                                </div>

                                <div className="text-right md:text-center flex-shrink-0">
                                    <p className="text-xs text-gray-400 mb-0.5">Conservación</p>
                                    <p className="font-display text-lg font-bold text-primary-600">
                                        {piece.conservationState}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {!pieces || pieces.length === 0 ? (
                <div className="text-center py-16">
                    <span className="text-6xl block mb-4">🏆</span>
                    <p className="text-gray-500">No hay piezas en la colección aún</p>
                </div>
            ) : null}
        </div>
    );
};
