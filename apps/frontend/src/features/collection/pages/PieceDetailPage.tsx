import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePiece, useToggleExchange, useDeletePiece, useSimilarPieces } from '../hooks/usePieces';
import { useAuth } from '../../auth/AuthContext';
import { Button } from '../../../shared/components/Button';
import { Spinner } from '../../../shared/components/Spinner';

const CONSERVATION_COLOR: Record<string, string> = {
    Excelente: 'bg-green-100 text-green-800',
    'Muy Bueno': 'bg-blue-100 text-blue-800',
    Bueno: 'bg-yellow-100 text-yellow-800',
    Regular: 'bg-gray-100 text-gray-700',
    Pobre: 'bg-red-100 text-red-800',
};

export const PieceDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isOwner } = useAuth();

    const { data: piece, isLoading, isError, error } = usePiece(id!);
    const { data: similar } = useSimilarPieces(id ?? '', 4);
    const toggleMutation = useToggleExchange();
    const deleteMutation = useDeletePiece();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleToggleExchange = async () => {
        if (!piece) return;
        try {
            await toggleMutation.mutateAsync({ id: piece.id, available: !piece.availableForExchange });
        } catch {
            alert('Error al actualizar el estado de intercambio');
        }
    };

    const handleDelete = async () => {
        if (!piece) return;
        try {
            await deleteMutation.mutateAsync(piece.id);
            navigate('/');
        } catch {
            alert('Error al eliminar la pieza');
        }
    };

    if (isLoading) return (
        <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>
    );

    if (isError || !piece) return (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <h3 className="text-red-800 font-semibold mb-2">Pieza no encontrada</h3>
            <p className="text-red-600 text-sm">{error instanceof Error ? error.message : 'Error desconocido'}</p>
            <Button variant="secondary" className="mt-4" onClick={() => navigate('/')}>
                ← Volver a la colección
            </Button>
        </div>
    );

    return (
        <div className="animate-slide-up">
            {/* Back */}
            <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6 transition-colors group"
            >
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver a la colección
            </button>

            <div className="bg-white rounded-3xl shadow-card overflow-hidden mb-8">
                <div className="md:flex">
                    {/* Image */}
                    <div className="md:w-5/12 relative">
                        <div className="h-72 md:h-full min-h-72 bg-gradient-to-br from-amber-50 to-gray-100">
                            <img
                                src={piece.imageUrl}
                                alt={piece.name}
                                className="w-full h-full object-cover"
                                onError={e => {
                                    (e.target as HTMLImageElement).src =
                                        'https://via.placeholder.com/600x400?text=Sin+Imagen';
                                }}
                            />
                        </div>
                        {/* Badges on image */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                            <span className={`badge px-3 py-1 text-xs font-semibold ${
                                piece.type === 'Moneda' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                            }`}>
                                {piece.type === 'Moneda' ? '🔵' : '🟢'} {piece.type}
                            </span>
                            {piece.availableForExchange && (
                                <span className="badge bg-emerald-500 text-white px-3 py-1 text-xs font-semibold">
                                    🔄 Para intercambio
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Details */}
                    <div className="md:w-7/12 p-8 flex flex-col">
                        <div className="flex-1">
                            <h1 className="font-display text-3xl font-bold text-gray-900 mb-1">{piece.name}</h1>
                            <p className="text-gray-500 text-sm mb-6">
                                Registrado el {new Date(piece.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-5">
                                {[
                                    { label: 'País', value: `🌍 ${piece.country}` },
                                    { label: 'Año', value: `📅 ${piece.year}` },
                                    {
                                        label: 'Conservación',
                                        value: piece.conservationState,
                                        badge: CONSERVATION_COLOR[piece.conservationState],
                                    },
                                    {
                                        label: 'Valor Estimado',
                                        value: `$${piece.estimatedValue.toLocaleString('es-ES', { minimumFractionDigits: 2 })} USD`,
                                        highlight: true,
                                    },
                                ].map(field => (
                                    <div key={field.label} className="bg-amber-50/50 rounded-xl p-3">
                                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{field.label}</p>
                                        {field.badge ? (
                                            <span className={`badge ${field.badge} text-xs px-2.5 py-1`}>{field.value}</span>
                                        ) : (
                                            <p className={`font-semibold ${field.highlight ? 'text-primary-600 text-lg' : 'text-gray-900'}`}>
                                                {field.value}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {piece.description && (
                                <div className="mb-6">
                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Descripción</p>
                                    <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 rounded-xl p-4">
                                        {piece.description}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                            {isOwner && (
                                <div className="flex gap-2">
                                    <Button
                                        variant="primary"
                                        onClick={() => navigate(`/pieces/${piece.id}/edit`)}
                                        className="flex-1"
                                    >
                                        ✏️ Editar Pieza
                                    </Button>
                                    <Button
                                        variant={piece.availableForExchange ? 'ghost' : 'secondary'}
                                        className={`flex-1 border ${piece.availableForExchange ? 'border-orange-200 text-orange-600 hover:bg-orange-50' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'}`}
                                        onClick={handleToggleExchange}
                                        isLoading={toggleMutation.isPending}
                                    >
                                        {piece.availableForExchange ? '🔒 Quitar de intercambio' : '🔄 Poner en intercambio'}
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => setShowDeleteModal(true)}
                                        className="px-3"
                                    >
                                        🗑️
                                    </Button>
                                </div>
                            )}
                            {!isOwner && piece.availableForExchange && (
                                <Link
                                    to={`/exchanges/new?toPiece=${piece.id}`}
                                    className="btn btn-primary py-2.5 rounded-xl text-center font-semibold"
                                >
                                    🤝 Solicitar Intercambio
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Similar Pieces — HU-11 */}
            {similar && similar.length > 0 && (
                <div className="mt-10 animate-slide-up">
                    <div className="flex items-center gap-2 mb-5">
                        <span className="text-2xl">✨</span>
                        <div>
                            <h2 className="font-display text-2xl font-bold text-gray-900">Piezas similares</h2>
                            <p className="text-gray-500 text-sm">Basado en país, año y tipo</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {similar.map(sp => (
                            <div
                                key={sp.id}
                                onClick={() => navigate(`/pieces/${sp.id}`)}
                                className="card cursor-pointer group hover:ring-2 hover:ring-primary-300 transition-all"
                            >
                                <div className="h-28 overflow-hidden">
                                    <img
                                        src={sp.imageUrl}
                                        alt={sp.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={e => {
                                            (e.target as HTMLImageElement).src =
                                                'https://via.placeholder.com/200x150?text=Pieza';
                                        }}
                                    />
                                </div>
                                <div className="p-3">
                                    <p className="font-semibold text-xs text-gray-900 line-clamp-2 mb-1">{sp.name}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">{sp.country} · {sp.year}</span>
                                        <span className="text-xs font-bold text-primary-600">
                                            ${sp.estimatedValue.toFixed(0)}
                                        </span>
                                    </div>
                                    {sp.availableForExchange && (
                                        <span className="badge badge-green text-[10px] mt-1.5">🔄 Intercambio</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <div className="text-center mb-5">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h3 className="font-display text-xl font-bold text-gray-900 mb-1">¿Eliminar pieza?</h3>
                            <p className="text-gray-500 text-sm">
                                Se eliminará permanentemente <strong>{piece.name}</strong> de tu colección.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="danger"
                                isLoading={deleteMutation.isPending}
                                className="flex-1"
                                onClick={handleDelete}
                            >
                                Sí, eliminar
                            </Button>
                            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
