import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePieces, useToggleExchange, useDeletePiece } from '../hooks/usePieces';
import { useAuth } from '../../auth/AuthContext';
import { PieceCard } from '../components/PieceCard';
import { Spinner } from '../../../shared/components/Spinner';
import type { PieceFilters, PieceType, ConservationState } from '../../../shared/types';

const COUNTRIES = ['Argentina', 'México', 'Estados Unidos', 'España', 'Venezuela', 'Suiza', 'Colombia', 'Reino Unido', 'Chile', 'Bolivia'];
const CONSERVATION_STATES: ConservationState[] = ['Excelente', 'Muy Bueno', 'Bueno', 'Regular', 'Pobre'];

export const CollectionListPage = () => {
    const { data: pieces, isLoading, isError, error } = usePieces();
    const toggleMutation = useToggleExchange();
    const deleteMutation = useDeletePiece();
    const { isOwner } = useAuth();

    const [togglingId, setTogglingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const [filters, setFilters] = useState<PieceFilters>({
        search: '',
        country: '',
        type: '',
        conservationState: '',
    });
    const [showFilters, setShowFilters] = useState(false);

    const handleToggleExchange = async (id: string, available: boolean) => {
        setTogglingId(id);
        try {
            await toggleMutation.mutateAsync({ id, available });
        } catch {
            alert('Error al actualizar el estado de intercambio');
        } finally {
            setTogglingId(null);
        }
    };

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            await deleteMutation.mutateAsync(id);
        } catch {
            alert('Error al eliminar la pieza');
        } finally {
            setDeletingId(null);
            setConfirmDeleteId(null);
        }
    };

    const updateFilter = (key: keyof PieceFilters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const filteredPieces = useMemo(() => {
        if (!pieces) return [];
        return pieces.filter(p => {
            const q = (filters.search ?? '').toLowerCase();
            if (q && !`${p.name} ${p.country} ${p.description}`.toLowerCase().includes(q)) return false;
            if (filters.country && p.country !== filters.country) return false;
            if (filters.type && p.type !== filters.type) return false;
            if (filters.conservationState && p.conservationState !== filters.conservationState) return false;
            return true;
        });
    }, [pieces, filters]);

    const hasActiveFilters = filters.search || filters.country || filters.type || filters.conservationState;
    const availableForExchange = filteredPieces.filter(p => p.availableForExchange).length;

    if (isLoading) return (
        <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
        </div>
    );

    if (isError) return (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
            <h3 className="text-red-800 font-semibold mb-1">Error al cargar la colección</h3>
            <p className="text-red-600 text-sm">{error instanceof Error ? error.message : 'Error desconocido'}</p>
        </div>
    );

    return (
        <div className="animate-slide-up">
            {/* Hero */}
            <div className="page-hero mb-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-10 text-8xl">🪙</div>
                    <div className="absolute bottom-0 left-10 text-6xl">💵</div>
                </div>
                <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="font-display text-4xl font-bold mb-1">Mi Colección</h1>
                        <p className="text-primary-100">
                            {pieces?.length ?? 0} piezas · {availableForExchange} disponibles para intercambio
                        </p>
                    </div>
                    {isOwner && (
                        <Link
                            to="/pieces/new"
                            className="btn btn-gold self-start sm:self-auto px-5 py-2.5 rounded-xl font-semibold text-sm"
                        >
                            ➕ Agregar Pieza
                        </Link>
                    )}
                </div>

                {/* Stats row */}
                <div className="flex flex-wrap gap-4 mt-5">
                    {[
                        { label: 'Total piezas', value: pieces?.length ?? 0, icon: '🪙' },
                        { label: 'Monedas', value: pieces?.filter(p => p.type === 'Moneda').length ?? 0, icon: '🔵' },
                        { label: 'Billetes', value: pieces?.filter(p => p.type === 'Billete').length ?? 0, icon: '🟢' },
                        {
                            label: 'Valor total',
                            value: `$${(pieces ?? []).reduce((s, p) => s + p.estimatedValue, 0).toLocaleString('es-ES', { minimumFractionDigits: 0 })}`,
                            icon: '💰',
                        },
                    ].map(stat => (
                        <div key={stat.label} className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-white text-sm">
                            <span className="mr-1.5">{stat.icon}</span>
                            <span className="font-semibold">{stat.value}</span>
                            <span className="text-primary-100 ml-1.5">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Search & Filters (HU-10) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
                <div className="flex gap-3">
                    <div className="flex-1 relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Buscar por nombre, país, descripción..."
                            value={filters.search}
                            onChange={e => updateFilter('search', e.target.value)}
                            className="input pl-9 py-2.5 text-sm"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                            showFilters || hasActiveFilters
                                ? 'bg-primary-50 border-primary-300 text-primary-700'
                                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm3 4a1 1 0 011-1h10a1 1 0 010 2H7a1 1 0 01-1-1zm3 4a1 1 0 011-1h4a1 1 0 010 2h-4a1 1 0 01-1-1z" />
                        </svg>
                        Filtros
                        {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-primary-500" />}
                    </button>
                </div>

                {showFilters && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-gray-100 animate-fade-in">
                        <div>
                            <label className="label text-xs">País</label>
                            <select className="input text-sm py-2" value={filters.country ?? ''} onChange={e => updateFilter('country', e.target.value)}>
                                <option value="">Todos los países</option>
                                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="label text-xs">Tipo</label>
                            <select className="input text-sm py-2" value={filters.type ?? ''} onChange={e => updateFilter('type', e.target.value as PieceType)}>
                                <option value="">Todos los tipos</option>
                                <option value="Moneda">Moneda</option>
                                <option value="Billete">Billete</option>
                            </select>
                        </div>
                        <div>
                            <label className="label text-xs">Estado de conservación</label>
                            <select className="input text-sm py-2" value={filters.conservationState ?? ''} onChange={e => updateFilter('conservationState', e.target.value as ConservationState)}>
                                <option value="">Cualquier estado</option>
                                {CONSERVATION_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        {hasActiveFilters && (
                            <div className="sm:col-span-3 flex justify-end">
                                <button
                                    onClick={() => setFilters({ search: '', country: '', type: '', conservationState: '' })}
                                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                                >
                                    × Limpiar filtros
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Results count */}
            {hasActiveFilters && (
                <p className="text-sm text-gray-500 mb-4">
                    {filteredPieces.length} resultado{filteredPieces.length !== 1 ? 's' : ''} encontrado{filteredPieces.length !== 1 ? 's' : ''}
                </p>
            )}

            {/* Empty */}
            {filteredPieces.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                    <span className="text-6xl block mb-4">{hasActiveFilters ? '🔍' : '🪙'}</span>
                    <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">
                        {hasActiveFilters ? 'Sin resultados' : 'Tu colección está vacía'}
                    </h3>
                    <p className="text-gray-500 mb-6">
                        {hasActiveFilters ? 'Prueba con otros filtros' : 'Comienza agregando tu primera pieza'}
                    </p>
                    {!hasActiveFilters && isOwner && (
                        <Link to="/pieces/new" className="btn btn-primary px-6 py-2.5 rounded-xl">
                            ➕ Agregar primera pieza
                        </Link>
                    )}
                </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredPieces.map(piece => (
                    <PieceCard
                        key={piece.id}
                        piece={piece}
                        onToggleExchange={isOwner ? handleToggleExchange : undefined}
                        isToggling={togglingId === piece.id}
                        onDelete={isOwner ? (id) => setConfirmDeleteId(id) : undefined}
                        isDeleting={deletingId === piece.id}
                    />
                ))}
            </div>

            {/* Delete confirm modal */}
            {confirmDeleteId && (
                <div className="modal-overlay" onClick={() => setConfirmDeleteId(null)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <div className="text-center mb-5">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h3 className="font-display text-xl font-bold text-gray-900 mb-1">¿Eliminar pieza?</h3>
                            <p className="text-gray-500 text-sm">
                                {pieces?.find(p => p.id === confirmDeleteId)?.name}<br/>
                                Esta acción no se puede deshacer.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleDelete(confirmDeleteId)}
                                disabled={deletingId === confirmDeleteId}
                                className="flex-1 btn btn-danger px-4 py-2.5 rounded-xl text-sm font-semibold"
                            >
                                {deletingId === confirmDeleteId ? 'Eliminando...' : '🗑️ Sí, eliminar'}
                            </button>
                            <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="flex-1 btn btn-secondary px-4 py-2.5 rounded-xl text-sm font-semibold"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
