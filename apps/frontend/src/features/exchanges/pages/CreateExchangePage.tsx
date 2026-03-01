import { useState, type FormEvent, useEffect } from 'react';
import { useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { usePieces } from '../../collection/hooks/usePieces';
import { useCreateExchange } from '../hooks/useExchanges';
import { useAuth } from '../../auth/AuthContext';
import { Select } from '../../../shared/components/Select';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { Spinner } from '../../../shared/components/Spinner';
import type { Piece } from '../../../shared/types';

export const CreateExchangePage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { data: pieces, isLoading } = usePieces();
    const createExchangeMutation = useCreateExchange();
    const { user, isOwner } = useAuth();

    if (isOwner) return <Navigate to="/exchanges" replace />;

    const preselectedToPiece = searchParams.get('toPiece') ?? '';

    const [fromPieceId, setFromPieceId] = useState('');
    const [toPieceId, setToPieceId] = useState(preselectedToPiece);
    const [requesterName, setRequesterName] = useState(user?.name ?? '');
    const [requesterEmail, setRequesterEmail] = useState(user?.email ?? '');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (preselectedToPiece) setToPieceId(preselectedToPiece);
    }, [preselectedToPiece]);

    const allPieces = pieces ?? [];
    const availablePieces = pieces?.filter(p => p.availableForExchange) ?? [];

    const selectedFromPiece = allPieces.find(p => p.id === fromPieceId);
    const selectedToPiece = allPieces.find(p => p.id === toPieceId);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!requesterName.trim()) newErrors.requesterName = 'Ingresa tu nombre';
        if (!requesterEmail.trim()) newErrors.requesterEmail = 'Ingresa tu correo';
        else if (!/\S+@\S+\.\S+/.test(requesterEmail)) newErrors.requesterEmail = 'Correo inválido';
        if (!fromPieceId) newErrors.fromPieceId = 'Selecciona la pieza que ofreces';
        if (!toPieceId) newErrors.toPieceId = 'Selecciona la pieza que deseas';
        if (fromPieceId === toPieceId) newErrors.toPieceId = 'No puedes intercambiar la misma pieza';
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
                toUserId: 'user-1',
                requesterName: requesterName.trim(),
                requesterEmail: requesterEmail.trim(),
                message: message.trim() || undefined,
            });
            navigate('/exchanges');
        } catch {
            alert('Error al crear la solicitud');
        }
    };

    if (isLoading) return (
        <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>
    );

    const PiecePreview = ({ piece, title }: { piece?: Piece; title: string }) => {
        if (!piece) {
            return (
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center text-gray-400 bg-gray-50">
                    <span className="text-3xl block mb-2">🪙</span>
                    <p className="text-sm">{title}</p>
                </div>
            );
        }
        return (
            <div className="card overflow-hidden">
                <div className="h-28 bg-gray-100">
                    <img src={piece.imageUrl} alt={piece.name} className="w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200'; }} />
                </div>
                <div className="p-3">
                    <h4 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-1">{piece.name}</h4>
                    <div className="text-xs text-gray-500 space-y-0.5">
                        <p>{piece.country} · {piece.year}</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-2xl mx-auto animate-slide-up">
            <div className="page-hero mb-8">
                <div className="flex items-center gap-3 mb-1">
                    <h1 className="font-display text-3xl font-bold">Solicitar Intercambio</h1>
                </div>
                <p className="text-primary-100 text-sm">Propone un intercambio justo para ambas partes</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Contact info */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-display text-lg font-bold text-gray-900 mb-4">Tus datos de contacto</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input id="requesterName" label="Tu nombre" type="text" placeholder="Carlos Mendoza"
                            value={requesterName} error={errors.requesterName}
                            onChange={e => { setRequesterName(e.target.value); setErrors({...errors, requesterName: ''}); }} required />
                        <Input id="requesterEmail" label="Tu correo" type="email" placeholder="carlos@email.com"
                            value={requesterEmail} error={errors.requesterEmail}
                            onChange={e => { setRequesterEmail(e.target.value); setErrors({...errors, requesterEmail: ''}); }} required />
                    </div>
                </div>

                {/* Piece selection */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-display text-lg font-bold text-gray-900 mb-4">Selecciona las piezas</h2>
                    <div className="space-y-4">
                        <Select id="fromPieceId" label="Pieza que ofreces a cambio" value={fromPieceId}
                            onChange={e => { setFromPieceId(e.target.value); setErrors({...errors, fromPieceId: ''}); }}
                            options={allPieces.map(p => ({ value: p.id, label: `${p.name} (${p.country}, ${p.year})` }))}
                            error={errors.fromPieceId} required />

                        <Select id="toPieceId" label="Pieza que deseas obtener" value={toPieceId}
                            onChange={e => { setToPieceId(e.target.value); setErrors({...errors, toPieceId: ''}); }}
                            options={availablePieces.map(p => ({ value: p.id, label: `${p.name} (${p.country}, ${p.year})` }))}
                            error={errors.toPieceId} required />
                    </div>
                </div>

                {/* Preview */}
                {(selectedFromPiece || selectedToPiece) && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="font-display text-lg font-bold text-gray-900 mb-4">Vista previa</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Ofreces</p>
                                <PiecePreview piece={selectedFromPiece} title="Selecciona tu pieza" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Quieres</p>
                                <PiecePreview piece={selectedToPiece} title="Selecciona pieza deseada" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Message */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-display text-lg font-bold text-gray-900 mb-4">Mensaje para el coleccionista</h2>
                    <textarea
                        rows={3}
                        placeholder="Explica tu propuesta, por qué te interesa la pieza, o cualquier detalle adicional..."
                        className="input resize-none"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                    />
                </div>

                <div className="flex gap-3 pb-8">
                    <Button type="submit" variant="primary" isLoading={createExchangeMutation.isPending} size="lg" className="flex-1">
                        Enviar Solicitud
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => navigate('/exchanges')} disabled={createExchangeMutation.isPending} size="lg">
                        Cancelar
                    </Button>
                </div>
            </form>
        </div>
    );
};
