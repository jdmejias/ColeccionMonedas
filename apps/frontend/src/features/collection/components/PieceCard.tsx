import { useNavigate } from 'react-router-dom';
import type { Piece } from '../../../shared/types';

interface PieceCardProps {
    piece: Piece;
    onToggleExchange?: (id: string, available: boolean) => void;
    isToggling?: boolean;
    onDelete?: (id: string) => void;
    isDeleting?: boolean;
}

const CONSERVATION_COLOR: Record<string, string> = {
    Excelente: 'badge-green',
    'Muy Bueno': 'badge-blue',
    Bueno: 'badge-yellow',
    Regular: 'badge-gray',
    Pobre: 'badge-red',
};

export const PieceCard = ({
    piece,
    onToggleExchange,
    isToggling,
    onDelete,
    isDeleting,
}: PieceCardProps) => {
    const navigate = useNavigate();

    return (
        <div className="card group flex flex-col h-full animate-fade-in">
            {/* Image */}
            <div className="relative h-44 bg-gradient-to-br from-amber-50 to-gray-100 overflow-hidden">
                <img
                    src={piece.imageUrl}
                    alt={piece.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e => {
                        (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1621762389513-6587d02c39a8?w=400&h=300&fit=crop&blur=10';
                    }}
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                {/* Type badge */}
                <div className="absolute top-2.5 left-2.5">
                    <span className={`tag text-[11px] ${piece.type === 'Moneda' ? 'bg-blue-50/90 text-blue-700 border-blue-100' : 'bg-green-50/90 text-green-700 border-green-100'} backdrop-blur-sm`}>
                        {piece.type === 'Moneda' ? '🔵' : '🟢'} {piece.type}
                    </span>
                </div>

                {/* Exchange badge */}
                {piece.availableForExchange && (
                    <div className="absolute top-2.5 right-2.5">
                        <span className="badge badge-green text-[11px] bg-emerald-500/90 text-white backdrop-blur-sm border-0">
                            🔄 Intercambio
                        </span>
                    </div>
                )}

                {/* Value bottom-right */}
                <div className="absolute bottom-2.5 right-2.5 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                    ${piece.estimatedValue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </div>
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-display font-bold text-gray-900 text-sm leading-tight mb-2 line-clamp-2 flex-grow-0">
                    {piece.name}
                </h3>

                <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="tag text-[11px]">🌍 {piece.country}</span>
                    <span className="tag text-[11px]">📅 {piece.year}</span>
                    <span className={`badge ${CONSERVATION_COLOR[piece.conservationState] ?? 'badge-gray'} text-[11px]`}>
                        {piece.conservationState}
                    </span>
                </div>

                {piece.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-1">{piece.description}</p>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-2 mt-auto pt-3 border-t border-gray-100">
                    <button
                        onClick={() => navigate(`/pieces/${piece.id}`)}
                        className="btn btn-primary text-xs py-2 rounded-xl w-full"
                    >
                        Ver Detalle
                    </button>

                    <div className="flex gap-1.5">
                        {onToggleExchange && (
                            <button
                                onClick={() => navigate(`/pieces/${piece.id}/edit`)}
                                className="btn btn-secondary text-xs py-1.5 rounded-xl flex-1"
                            >
                                ✏️ Editar
                            </button>
                        )}

                        {onToggleExchange && (
                            <button
                                onClick={() => onToggleExchange(piece.id, !piece.availableForExchange)}
                                disabled={isToggling}
                                className={`btn text-xs py-1.5 rounded-xl flex-1 ${
                                    piece.availableForExchange
                                        ? 'btn-ghost border border-orange-200 text-orange-600 hover:bg-orange-50'
                                        : 'btn-ghost border border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                                }`}
                            >
                                {isToggling ? '...' : piece.availableForExchange ? '🔒' : '🔄'}
                            </button>
                        )}

                        {onDelete && (
                            <button
                                onClick={() => onDelete(piece.id)}
                                disabled={isDeleting}
                                className="btn btn-ghost text-xs py-1.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 px-2.5"
                            >
                                {isDeleting ? '...' : '🗑️'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};



