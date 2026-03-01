import { useState } from 'react';
import { useExchangeHistory } from '../hooks/useExchanges';
import { usePieces } from '../../collection/hooks/usePieces';
import { Spinner } from '../../../shared/components/Spinner';
import type { ExchangeStatus } from '../../../shared/types';

const STATUS_LABEL: Record<ExchangeStatus, string> = {
    pending: 'Pendiente',
    accepted: 'Aceptado',
    rejected: 'Rechazado',
    countered: 'Contraoferta',
    counter_accepted: 'Contraoferta Acept.',
    counter_rejected: 'Contraoferta Rechaz.',
};

const STATUS_CLASS: Record<ExchangeStatus, string> = {
    pending: 'badge-yellow',
    accepted: 'badge-green',
    rejected: 'badge-red',
    countered: 'badge-blue',
    counter_accepted: 'badge-green',
    counter_rejected: 'badge-red',
};

const STATUS_ICON: Record<ExchangeStatus, string> = {
    pending: '',
    accepted: '',
    rejected: '',
    countered: '',
    counter_accepted: '',
    counter_rejected: '',
};

export const ExchangeHistoryPage = () => {
    const { data: history, isLoading } = useExchangeHistory();
    const { data: pieces } = usePieces();
    const [filter, setFilter] = useState<ExchangeStatus | 'all'>('all');

    const getPieceName = (id: string) => pieces?.find(p => p.id === id)?.name ?? `Pieza #${id}`;

    const filtered = (history ?? []).filter(e => filter === 'all' || e.status === filter);

    // Stats
    const total = history?.length ?? 0;
    const accepted = history?.filter(e => e.status === 'accepted' || e.status === 'counter_accepted').length ?? 0;
    const rejected = history?.filter(e => e.status === 'rejected' || e.status === 'counter_rejected').length ?? 0;

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
            <div className="page-hero mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="font-display text-4xl font-bold">Historial de Intercambios</h1>
                </div>
                <p className="text-primary-100">Registro completo de todos los intercambios finalizados</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="stat-card">
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{total}</p>
                        <p className="text-xs text-gray-500">Total finalizados</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div>
                        <p className="text-2xl font-bold text-emerald-600">{accepted}</p>
                        <p className="text-xs text-gray-500">Aceptados</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div>
                        <p className="text-2xl font-bold text-red-600">{rejected}</p>
                        <p className="text-xs text-gray-500">Rechazados</p>
                    </div>
                </div>
            </div>

            {/* Filter bar */}
            <div className="flex flex-wrap gap-2 mb-6">
                {(['all', 'accepted', 'rejected', 'counter_accepted', 'counter_rejected'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
                            filter === f
                                ? 'bg-primary-600 text-white shadow-sm'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
                        }`}
                    >
                        {f === 'all' ? `Todos (${total})` : `${STATUS_ICON[f as ExchangeStatus]} ${STATUS_LABEL[f as ExchangeStatus]}`}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                    <span className="text-5xl block mb-3">📭</span>
                    <p className="text-gray-500">No hay intercambios en esta categoría</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map(exchange => (
                        <div key={exchange.id} className="bg-white rounded-2xl shadow-card p-5 border border-gray-100 hover:shadow-card-hover transition-shadow">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-xl">
                                        {STATUS_ICON[exchange.status]}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Intercambio #{exchange.id}</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(exchange.createdAt).toLocaleDateString('es-ES', {
                                                day: 'numeric', month: 'long', year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <span className={`badge self-start ${STATUS_CLASS[exchange.status]} py-1 px-3`}>
                                    {STATUS_ICON[exchange.status]} {STATUS_LABEL[exchange.status]}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-3">
                                <div className="bg-gray-50 rounded-xl p-3">
                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Solicitante</p>
                                    <p className="font-medium text-gray-900">{exchange.requesterName}</p>
                                    <p className="text-gray-500 text-xs">{exchange.requesterEmail}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-3">
                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Piezas</p>
                                    <p className="text-gray-700">🎁 Ofreció: <span className="font-medium">{getPieceName(exchange.fromPieceId)}</span></p>
                                    <p className="text-gray-700">🎯 Quería: <span className="font-medium">{getPieceName(exchange.toPieceId)}</span></p>
                                </div>
                            </div>

                            {exchange.message && (
                                <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-800 mb-2">
                                    <span className="font-semibold">Mensaje: </span>{exchange.message}
                                </div>
                            )}

                            {exchange.completedAt && (
                                <p className="text-xs text-gray-400">
                                    Finalizado: {new Date(exchange.completedAt).toLocaleDateString('es-ES', {
                                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                    })}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
