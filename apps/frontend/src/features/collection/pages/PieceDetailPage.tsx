import { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePiece, useToggleExchange, useDeletePiece, useSimilarPieces } from '../hooks/usePieces';
import { useComments, useAddComment, useDeleteComment } from '../hooks/useComments';
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

const FALLBACK_IMG = 'https://via.placeholder.com/600x400?text=Sin+Imagen';

export const PieceDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isOwner, user } = useAuth();

    const { data: piece, isLoading, isError, error } = usePiece(id!);
    const { data: similar } = useSimilarPieces(id ?? '', 4);
    const toggleMutation = useToggleExchange();
    const deleteMutation = useDeletePiece();

    const { data: comments = [], isLoading: commentsLoading } = useComments(id!);
    const addCommentMutation = useAddComment(id!);
    const deleteCommentMutation = useDeleteComment(id!);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [lightboxImg, setLightboxImg] = useState<string | null>(null);
    const [lightboxSide, setLightboxSide] = useState<'front' | 'back'>('front');
    const [imgTab, setImgTab] = useState<'front' | 'back'>('front');
    const imgRef = useRef<HTMLImageElement | null>(null);
    const [zoomPos, setZoomPos] = useState<{ x: number; y: number; w: number; h: number; }>(
        { x: 0, y: 0, w: 0, h: 0 }
    );
    const [isZoomActive, setIsZoomActive] = useState(false);
    const zoomLevel = 2.6; // magnification

    const computeBgPos = (pos: number, dim: number) => {
        if (!dim || dim === 0) return '50';
        const pct = (pos / dim) * 100;
        return Math.max(0, Math.min(100, pct)).toString();
    };
    const [commentText, setCommentText] = useState('');
    const [commentAuthor, setCommentAuthor] = useState(user?.name ?? '');

    const hasBack = !!piece?.imageUrlBack;
    const currentImg = imgTab === 'back' && hasBack ? piece!.imageUrlBack! : (piece?.imageUrl ?? '');

    const openLightbox = (side: 'front' | 'back') => {
        setLightboxSide(side);
        setLightboxImg(side === 'back' && piece?.imageUrlBack ? piece.imageUrlBack : piece?.imageUrl ?? '');
    };

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

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        try {
            await addCommentMutation.mutateAsync({
                authorName: commentAuthor.trim() || 'Visitante',
                text: commentText.trim(),
            });
            setCommentText('');
        } catch {
            alert('Error al publicar el comentario');
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
                    {/* Image section */}
                    <div className="md:w-5/12 relative flex flex-col">
                        {/* Tab selector */}
                        {hasBack && (
                            <div className="flex border-b border-gray-100 bg-gray-50 z-10">
                                <button
                                    onClick={() => setImgTab('front')}
                                    className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${imgTab === 'front' ? 'bg-white text-primary-700 border-b-2 border-primary-500' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Anverso
                                </button>
                                <button
                                    onClick={() => setImgTab('back')}
                                    className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${imgTab === 'back' ? 'bg-white text-primary-700 border-b-2 border-primary-500' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Reverso
                                </button>
                            </div>
                        )}

                        <div
                            className="h-72 md:h-full min-h-64 bg-gradient-to-br from-amber-50 to-gray-100 relative group cursor-zoom-in"
                            onClick={() => openLightbox(imgTab)}
                            title="Clic para ampliar"
                        >
                            <img
                                key={currentImg}
                                src={currentImg}
                                alt={imgTab === 'back' ? `${piece.name} (reverso)` : piece.name}
                                className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                                onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-2.5 shadow-lg">
                                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2" style={{ top: hasBack ? '3rem' : '1rem' }}>
                            <span className={`badge px-3 py-1 text-xs font-semibold ${piece.type === 'Moneda' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}`}>
                                {piece.type}
                            </span>
                            {piece.availableForExchange && (
                                <span className="badge bg-emerald-500 text-white px-3 py-1 text-xs font-semibold">
                                    Para intercambio
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
                                    { label: 'País', value: piece.country },
                                    { label: 'Año', value: piece.year },
                                    { label: 'Conservación', value: piece.conservationState, badge: CONSERVATION_COLOR[piece.conservationState] },
                                ].map(field => (
                                    <div key={field.label} className="bg-amber-50/50 rounded-xl p-3">
                                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{field.label}</p>
                                        {field.badge ? (
                                            <span className={`badge ${field.badge} text-xs px-2.5 py-1`}>{field.value}</span>
                                        ) : (
                                            <p className="font-semibold text-gray-900">{field.value}</p>
                                        )}
                                    </div>
                                ))}
                            </div>

                           {piece.description && (
                                <div className="mb-6">
                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Descripción</p>
                                    <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 rounded-xl p-4">{piece.description}</p>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                            {isOwner && (
                                <div className="flex gap-2">
                                    <Button variant="primary" onClick={() => navigate(`/pieces/${piece.id}/edit`)} className="flex-1">
                                        Editar Pieza
                                    </Button>
                                    <Button
                                        variant={piece.availableForExchange ? 'ghost' : 'secondary'}
                                        className={`flex-1 border ${piece.availableForExchange ? 'border-orange-200 text-orange-600 hover:bg-orange-50' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'}`}
                                        onClick={handleToggleExchange}
                                        isLoading={toggleMutation.isPending}
                                    >
                                        {piece.availableForExchange ? '❌ Quitar de intercambio' : '✅ Poner en intercambio'}
                                    </Button>
                                    <Button variant="danger" onClick={() => setShowDeleteModal(true)} className="px-3">🗑️</Button>
                                </div>
                            )}
                            {!isOwner && piece.availableForExchange && (
                                <Link to={`/exchanges/new?toPiece=${piece.id}`} className="btn btn-primary py-2.5 rounded-xl text-center font-semibold">
                                    Solicitar Intercambio
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-3xl shadow-card p-8 mb-8 animate-slide-up">
                <div className="flex items-center gap-2 mb-5">

                    <div>
                        <h2 className="font-display text-xl font-bold text-gray-900">Comentarios</h2>
                        <p className="text-gray-500 text-sm">{comments.length} {comments.length === 1 ? 'comentario' : 'comentarios'}</p>
                    </div>
                </div>

                <form onSubmit={handleAddComment} className="bg-gray-50 rounded-2xl p-4 mb-6">
                    <input
                        type="text"
                        placeholder="Tu nombre (opcional)"
                        value={commentAuthor}
                        onChange={e => setCommentAuthor(e.target.value)}
                        className="input text-sm py-2 w-full mb-2"
                    />
                    <textarea
                        placeholder="Escribe un comentario sobre esta pieza..."
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        rows={3}
                        className="input text-sm py-2 w-full resize-none leading-relaxed mb-3"
                        required
                    />
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={!commentText.trim() || addCommentMutation.isPending}
                            className="btn btn-primary text-sm px-5 py-2 rounded-xl disabled:opacity-50"
                        >
                            {addCommentMutation.isPending ? 'Publicando...' : 'Publicar'}
                        </button>
                    </div>
                </form>

                {commentsLoading ? (
                    <div className="flex justify-center py-6"><Spinner /></div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <p className="text-sm">Sé el primero en comentar esta pieza</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {comments.map(comment => (
                            <div key={comment.id} className="flex gap-3 group">
                                <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                    {comment.authorName.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-3">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-semibold text-sm text-gray-900">{comment.authorName}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-400">
                                                {new Date(comment.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                            {isOwner && (
                                                <button
                                                    onClick={() => deleteCommentMutation.mutate(comment.id)}
                                                    disabled={deleteCommentMutation.isPending}
                                                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 text-xs transition-opacity"
                                                    title="Eliminar comentario"
                                                >×</button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-gray-700 text-sm leading-relaxed">{comment.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Similar Pieces */}
            {similar && similar.length > 0 && (
                <div className="mb-8 animate-slide-up">
                    <div className="flex items-center gap-2 mb-5">
                        <div>
                            <h2 className="font-display text-2xl font-bold text-gray-900">Piezas similares</h2>
                            <p className="text-gray-500 text-sm">Basado en país, año y tipo</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {similar.map(sp => (
                            <div key={sp.id} onClick={() => navigate(`/pieces/${sp.id}`)}
                                className="card cursor-pointer group hover:ring-2 hover:ring-primary-300 transition-all">
                                <div className="h-28 overflow-hidden">
                                    <img src={sp.imageUrl} alt={sp.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x150?text=Pieza'; }} />
                                </div>
                                <div className="p-3">
                                    <p className="font-semibold text-xs text-gray-900 line-clamp-2 mb-1">{sp.name}</p>
                                    <span className="text-xs text-gray-500">{sp.country} · {sp.year}</span>
                                    {sp.availableForExchange && <span className="badge badge-green text-[10px] mt-1.5 block">Intercambio</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Image Lightbox Modal */}
            {lightboxImg && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxImg(null)}>
                    <button
                        className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors z-10"
                        onClick={() => setLightboxImg(null)}
                        aria-label="Cerrar imagen"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {hasBack && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex bg-black/50 rounded-xl overflow-hidden z-10">
                            <button
                                onClick={e => { e.stopPropagation(); setLightboxSide('front'); setLightboxImg(piece.imageUrl); }}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${lightboxSide === 'front' ? 'bg-white/30 text-white' : 'text-white/60 hover:text-white'}`}
                            >Anverso</button>
                            <button
                                onClick={e => { e.stopPropagation(); setLightboxSide('back'); setLightboxImg(piece.imageUrlBack!); }}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${lightboxSide === 'back' ? 'bg-white/30 text-white' : 'text-white/60 hover:text-white'}`}
                            >Reverso</button>
                        </div>
                    )}

                    {/* Magnifier layout: left = image, right = zoomed area */}
                    <div className="w-full max-w-6xl max-h-[85vh] flex gap-6 items-start" onClick={e => e.stopPropagation()}>
                        <div className="flex-1 flex items-center justify-center">
                            <div className="relative bg-black/0 rounded-2xl overflow-hidden" style={{ maxWidth: '640px', maxHeight: '80vh' }}>
                                <img
                                    ref={imgRef as any}
                                    src={lightboxImg}
                                    alt={piece.name}
                                    className="w-full h-full object-contain block"
                                    onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                                    onMouseMove={(ev) => {
                                        const el = imgRef.current as HTMLImageElement | null;
                                        if (!el) return;
                                        const rect = el.getBoundingClientRect();
                                        const x = Math.max(0, Math.min(ev.clientX - rect.left, rect.width));
                                        const y = Math.max(0, Math.min(ev.clientY - rect.top, rect.height));
                                        setZoomPos({ x, y, w: rect.width, h: rect.height });
                                        setIsZoomActive(true);
                                    }}
                                    onMouseLeave={() => setIsZoomActive(false)}
                                />
                                {/* Lens indicator */}
                                {isZoomActive && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            left: Math.max(0, Math.min(zoomPos.x - 40, (zoomPos.w || 0) - 80)),
                                            top: Math.max(0, Math.min(zoomPos.y - 40, (zoomPos.h || 0) - 80)),
                                            width: 80,
                                            height: 80,
                                            borderRadius: '50%',
                                            border: '2px solid rgba(255,255,255,0.8)',
                                            boxShadow: '0 4px 18px rgba(0,0,0,0.4)',
                                            pointerEvents: 'none',
                                        }}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="w-80 h-80 bg-white rounded-2xl overflow-hidden shadow-2xl flex-shrink-0">
                            <div
                                className="w-full h-full bg-center bg-no-repeat"
                                style={{
                                    backgroundImage: `url(${lightboxImg})`,
                                    backgroundSize: `${zoomLevel * 100}%`,
                                    backgroundPosition: `${computeBgPos(zoomPos.x, zoomPos.w)}% ${computeBgPos(zoomPos.y, zoomPos.h)}%`,
                                }}
                            />
                        </div>
                    </div>

                    <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                        {piece.name}{lightboxSide === 'back' ? ' (Reverso)' : ''}
                    </p>
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
                            <Button variant="danger" isLoading={deleteMutation.isPending} className="flex-1" onClick={handleDelete}>
                                Sí, eliminar
                            </Button>
                            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
