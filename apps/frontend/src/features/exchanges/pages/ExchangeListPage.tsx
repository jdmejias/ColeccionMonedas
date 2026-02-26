import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    useExchanges,
    useUpdateExchangeStatus,
    useSendCounterOffer,
    useRespondToCounter,
} from '../hooks/useExchanges';
import { usePieces } from '../../collection/hooks/usePieces';
import { useAuth } from '../../auth/AuthContext';
import { Spinner } from '../../../shared/components/Spinner';
import { Button } from '../../../shared/components/Button';
import type { ExchangeRequest, ExchangeStatus } from '../../../shared/types';

const STATUS_LABEL: Record<ExchangeStatus, string> = {
    pending: 'Pendiente',
    accepted: 'Aceptado',
    rejected: 'Rechazado',
    countered: 'Contraoferta enviada',
    counter_accepted: 'Contraoferta aceptada',
    counter_rejected: 'Contraoferta rechazada',
};

const STATUS_CLASS: Record<ExchangeStatus, string> = {
    pending: 'badge-yellow',
    accepted: 'badge-green',
    rejected: 'badge-red',
    countered: 'badge-blue',
    counter_accepted: 'badge-green',
    counter_rejected: 'badge-red',
};

interface CounterModalProps {
    exchange: ExchangeRequest;
    onClose: () => void;
    onSend: (text: string) => void;
    isLoading: boolean;
}

const CounterModal = ({ exchange, onClose, onSend, isLoading }: CounterModalProps) => {
    const [text, setText] = useState('');
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
                <h3 className="font-display text-xl font-bold text-gray-900 mb-1">Enviar Contraoferta</h3>
                <p className="text-sm text-gray-500 mb-4">Intercambio #{exchange.id} — {exchange.requesterName}</p>
                <textarea
                    rows={4}
                    className="input resize-none w-full mb-4"
                    placeholder="Describe tu contraoferta o condición adicional..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                />
                <div className="flex gap-3">
                    <Button variant="primary" isLoading={isLoading} disabled={!text.trim()} onClick={() => onSend(text)} className="flex-1">
                        Enviar Contraoferta
                    </Button>
                    <Button variant="secondary" onClick={onClose} disabled={isLoading}>Cancelar</Button>
                </div>
            </div>
        </div>
    );
};

interface CounterResponseModalProps {
    exchange: ExchangeRequest;
    onClose: () => void;
    onRespond: (action: 'accept' | 'reject' | 'new', text?: string) => void;
    isLoading: boolean;
}

const CounterResponseModal = ({ exchange, onClose, onRespond, isLoading }: CounterResponseModalProps) => {
    const [newOffer, setNewOffer] = useState('');
    const [mode, setMode] = useState<'choose' | 'new'>('choose');

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
                <h3 className="font-display text-xl font-bold text-gray-900 mb-1">Responder Contraoferta</h3>
                <div className="bg-blue-50 rounded-xl p-3 mb-4 text-sm text-blue-800">
                    <span className="font-semibold">Contraoferta recibida: </span>{exchange.counterOffer}
                </div>

                {mode === 'choose' ? (
                    <div className="flex flex-col gap-3">
                        <Button variant="primary" isLoading={isLoading} onClick={() => onRespond('accept')} className="w-full">
                            ✅ Aceptar contraoferta
                        </Button>
                        <Button variant="ghost" isLoading={isLoading} onClick={() => setMode('new')} className="w-full border border-blue-300 text-blue-700">
                            💬 Proponer nueva oferta
                        </Button>
                        <Button variant="danger" isLoading={isLoading} onClick={() => onRespond('reject')} className="w-full">
                            ❌ Rechazar
                        </Button>
                        <Button variant="secondary" onClick={onClose} disabled={isLoading}>Cerrar</Button>
                    </div>
                ) : (
                    <>
                        <textarea
                            rows={4}
                            className="input resize-none w-full mb-4"
                            placeholder="Tu nueva propuesta..."
                            value={newOffer}
                            onChange={e => setNewOffer(e.target.value)}
                        />
                        <div className="flex gap-3">
                            <Button variant="primary" isLoading={isLoading} disabled={!newOffer.trim()} onClick={() => onRespond('new', newOffer)} className="flex-1">
                                Enviar Nueva Propuesta
                            </Button>
                            <Button variant="secondary" onClick={() => setMode('choose')}>Atrás</Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export const ExchangeListPage = () => {
    const { data: exchanges, isLoading, isError, error } = useExchanges();
    const { data: pieces } = usePieces();
    const { isOwner } = useAuth();
    const updateStatus = useUpdateExchangeStatus();
    const sendCounter = useSendCounterOffer();
    const respondCounter = useRespondToCounter();

    const [counterTarget, setCounterTarget] = useState<ExchangeRequest | null>(null);
    const [counterResponseTarget, setCounterResponseTarget] = useState<ExchangeRequest | null>(null);
    const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');

    const getPieceName = (id: string) => pieces?.find(p => p.id === id)?.name ?? `Pieza #${id}`;
    const getPieceImg = (id: string) =>
        pieces?.find(p => p.id === id)?.imageUrl ?? '';

    if (isLoading) return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;
    if (isError) return (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <p className="text-red-800 font-semibold">Error al cargar intercambios</p>
            <p className="text-red-600 text-sm mt-1">{error instanceof Error ? error.message : 'Error desconocido'}</p>
        </div>
    );

    const incomingStatuses: ExchangeStatus[] = ['pending', 'countered'];
    const outgoingStatuses: ExchangeStatus[] = ['accepted', 'rejected', 'counter_accepted', 'counter_rejected'];

    const incoming = (exchanges ?? []).filter(e => incomingStatuses.includes(e.status));
    const outgoing = (exchanges ?? []).filter(e => outgoingStatuses.includes(e.status));
    const shown = activeTab === 'incoming' ? incoming : outgoing;

    const pendingCount = incoming.filter(e => e.status === 'pending').length;

    return (
        <div className="animate-slide-up">
            {/* Hero */}
            <div className="page-hero mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-4xl">🔄</span>
                            <h1 className="font-display text-4xl font-bold">Intercambios</h1>
                        </div>
                        <p className="text-primary-100">Gestiona tus solicitudes de intercambio</p>
                    </div>
                    <Link
                        to="/exchanges/new"
                        className="btn btn-gold self-start sm:self-auto px-5 py-2.5 rounded-xl font-semibold text-sm"
                    >
                        🤝 Nueva solicitud
                    </Link>
                </div>
            </div>

            {/* Stats bar - solo visible para el coleccionista (owner) */}
            {isOwner && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Pendientes', value: incoming.filter(e => e.status === 'pending').length, color: 'text-yellow-600', bg: 'bg-yellow-50', icon: '⏳' },
                        { label: 'Contraofertas', value: incoming.filter(e => e.status === 'countered').length, color: 'text-blue-600', bg: 'bg-blue-50', icon: '💬' },
                        { label: 'Aceptados', value: outgoing.filter(e => e.status === 'accepted' || e.status === 'counter_accepted').length, color: 'text-green-600', bg: 'bg-green-50', icon: '✅' },
                        { label: 'Rechazados', value: outgoing.filter(e => e.status === 'rejected' || e.status === 'counter_rejected').length, color: 'text-red-600', bg: 'bg-red-50', icon: '❌' },
                    ].map(stat => (
                        <div key={stat.label} className={`${stat.bg} rounded-2xl p-4 flex items-center gap-3`}>
                            <span className="text-2xl">{stat.icon}</span>
                            <div>
                                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                                <p className="text-xs text-gray-500">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('incoming')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        activeTab === 'incoming'
                            ? 'bg-primary-600 text-white shadow-sm'
                            : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
                    }`}
                >
                    📥 Activas
                    {pendingCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingCount}</span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('outgoing')}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        activeTab === 'outgoing'
                            ? 'bg-primary-600 text-white shadow-sm'
                            : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
                    }`}
                >
                    ✅ Finalizadas ({outgoing.length})
                </button>
            </div>

            {/* Empty state */}
            {shown.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                    <span className="text-6xl block mb-3">🔄</span>
                    <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">No hay intercambios aquí</h3>
                    <p className="text-gray-500 mb-6">
                        {activeTab === 'incoming' ? 'No tienes solicitudes activas' : 'Aún no hay intercambios finalizados'}
                    </p>
                    <Link to="/exchanges/new" className="btn btn-primary px-6 py-2.5 rounded-xl text-sm">
                        Crear solicitud
                    </Link>
                </div>
            )}

            {/* Exchange cards */}
            <div className="space-y-4">
                {shown.map(exchange => (
                    <div
                        key={exchange.id}
                        className={`bg-white rounded-2xl shadow-card border overflow-hidden ${
                            exchange.status === 'pending' ? 'border-yellow-200' :
                            exchange.status === 'countered' ? 'border-blue-200' :
                            'border-gray-100'
                        }`}
                    >
                        <div className="p-5">
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                                        <span className="text-xl">🤝</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{exchange.requesterName}</p>
                                        <p className="text-xs text-gray-500">{exchange.requesterEmail} · {new Date(exchange.createdAt).toLocaleDateString('es-ES')}</p>
                                    </div>
                                </div>
                                <span className={`badge self-start sm:self-auto ${STATUS_CLASS[exchange.status]} py-1 px-3 text-xs`}>
                                    {STATUS_LABEL[exchange.status]}
                                </span>
                            </div>

                            {/* Pieces */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                {[
                                    { label: '🎁 Ofrece', id: exchange.fromPieceId },
                                    { label: '🎯 Quiere', id: exchange.toPieceId },
                                ].map(({ label, id }) => (
                                    <div key={id} className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                                        {getPieceImg(id) && (
                                            <img
                                                src={getPieceImg(id)}
                                                alt={getPieceName(id)}
                                                className="w-full h-20 object-cover"
                                                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                            />
                                        )}
                                        <div className="p-2">
                                            <p className="text-xs font-semibold text-gray-500 mb-0.5">{label}</p>
                                            <p className="text-xs font-medium text-gray-900 truncate">{getPieceName(id)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Message */}
                            {exchange.message && (
                                <div className="bg-amber-50 rounded-xl p-3 mb-4 text-sm text-amber-900 border border-amber-100">
                                    <span className="font-semibold">💬 Mensaje: </span>{exchange.message}
                                </div>
                            )}

                            {/* Counter offer */}
                            {exchange.counterOffer && (
                                <div className="bg-blue-50 rounded-xl p-3 mb-4 text-sm text-blue-800 border border-blue-100">
                                    <span className="font-semibold">🔁 Contraoferta: </span>{exchange.counterOffer}
                                </div>
                            )}

                            {/* Actions — Owner sees pending/countered, visitor sees countered to respond */}
                            {isOwner && exchange.status === 'pending' && (
                                <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                                    <Button
                                        size="sm"
                                        variant="primary"
                                        isLoading={updateStatus.isPending}
                                        onClick={() => updateStatus.mutate({ id: exchange.id, status: 'accepted' })}
                                    >
                                        ✅ Aceptar
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="border border-blue-300 text-blue-700 hover:bg-blue-50"
                                        onClick={() => setCounterTarget(exchange)}
                                    >
                                        💬 Contraoferta
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        isLoading={updateStatus.isPending}
                                        onClick={() => updateStatus.mutate({ id: exchange.id, status: 'rejected' })}
                                    >
                                        ❌ Rechazar
                                    </Button>
                                </div>
                            )}

                            {/* Visitor responds to counter */}
                            {!isOwner && exchange.status === 'countered' && (
                                <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                                    <Button size="sm" variant="primary" onClick={() => setCounterResponseTarget(exchange)}>
                                        💬 Responder contraoferta
                                    </Button>
                                </div>
                            )}

                            {/* Owner can also respond to visitor's new counter */}
                            {isOwner && exchange.status === 'countered' && (
                                <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                                    <Button size="sm" variant="primary" isLoading={updateStatus.isPending}
                                        onClick={() => updateStatus.mutate({ id: exchange.id, status: 'accepted' })}>
                                        ✅ Aceptar todo
                                    </Button>
                                    <Button size="sm" variant="danger" isLoading={updateStatus.isPending}
                                        onClick={() => updateStatus.mutate({ id: exchange.id, status: 'rejected' })}>
                                        ❌ Rechazar
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Counter offer modal */}
            {counterTarget && (
                <CounterModal
                    exchange={counterTarget}
                    onClose={() => setCounterTarget(null)}
                    isLoading={sendCounter.isPending}
                    onSend={text => {
                        sendCounter.mutate(
                            { id: counterTarget.id, counterOffer: text },
                            { onSuccess: () => setCounterTarget(null) }
                        );
                    }}
                />
            )}

            {/* Counter response modal */}
            {counterResponseTarget && (
                <CounterResponseModal
                    exchange={counterResponseTarget}
                    onClose={() => setCounterResponseTarget(null)}
                    isLoading={respondCounter.isPending}
                    onRespond={(action, text) => {
                        respondCounter.mutate(
                            { id: counterResponseTarget.id, action, newMessage: text },
                            { onSuccess: () => setCounterResponseTarget(null) }
                        );
                    }}
                />
            )}
        </div>
    );
};
