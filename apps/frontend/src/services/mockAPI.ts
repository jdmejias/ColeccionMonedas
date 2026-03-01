import type { Piece, CreatePieceDTO, UpdatePieceDTO, ExchangeRequest, CreateExchangeRequestDTO, ExchangeStatus } from '../shared/types';

/**
 * Validates that a piece name follows the format: "Name DenominationNumber"
 * where DenominationNumber includes a currency symbol and a numeric value.
 * Examples: "Peso Fuerte Argentino $1", "Morgan Dollar US$1", "Billete Bolívares Bs.5000"
 *
 * Pattern: at least one word, a space, then a denomination token containing
 * a currency symbol (non-alphanumeric, non-space) adjacent to digits.
 */
const PIECE_NAME_REGEX = /^[A-Za-zÀ-ÿ]+(\s[A-Za-zÀ-ÿ.]+)*\s+[^\s]*[^\w\s][^\s]*\d+[^\s]*$|^[A-Za-zÀ-ÿ]+(\s[A-Za-zÀ-ÿ.]+)*\s+\d+[^\w\s][^\s]*$/;

function validatePieceName(name: string): void {
    if (!PIECE_NAME_REGEX.test(name.trim())) {
        throw new Error(
            'El nombre debe incluir el nombre de la pieza y su denominación con símbolo de moneda. ' +
            'Formato: "Nombre Denominación" (Ej: "Peso Fuerte Argentino $1", "Morgan Dollar US$1", "Billete Bolívares Bs.5000")'
        );
    }
}

// In-memory storage (empty now that real DB is used)
let pieces: Piece[] = [];

let exchanges: ExchangeRequest[] = [
    {
        id: 'exc-1',
        fromUserId: 'user-2',
        toUserId: 'user-1',
        fromPieceId: '4',
        toPieceId: '1',
        status: 'pending',
        requesterName: 'Carlos Mendoza',
        requesterEmail: 'carlos@example.com',
        message: 'Me interesa mucho tu Peso Fuerte. Ofrezco mi 2 Reales coloniales, una pieza de gran valor histórico.',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'exc-2',
        fromUserId: 'user-3',
        toUserId: 'user-1',
        fromPieceId: '5',
        toPieceId: '3',
        status: 'countered',
        requesterName: 'Ana Sofía López',
        requesterEmail: 'ana@example.com',
        message: 'El Morgan Dollar es espectacular. Te ofrezco mi billete de Venezuela.',
        counterOffer: 'Acepto el intercambio pero necesitaría que además incluyeras algún accesorio de conservación o, alternativamente, le pongo valor adicional de $50 USD.',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'exc-3',
        fromUserId: 'user-4',
        toUserId: 'user-1',
        fromPieceId: '7',
        toPieceId: '9',
        status: 'accepted',
        requesterName: 'Roberto Figueroa',
        requesterEmail: 'roberto@example.com',
        message: '¡Gran colección! Intercambio perfecto entre piezas latinoamericanas.',
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'exc-4',
        fromUserId: 'user-5',
        toUserId: 'user-1',
        fromPieceId: '2',
        toPieceId: '10',
        status: 'rejected',
        requesterName: 'Valentina Rojas',
        requesterEmail: 'val@example.com',
        message: 'Quisiera el Real de a 8. El billete mexicano es una belleza también.',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'exc-5',
        fromUserId: 'user-6',
        toUserId: 'user-1',
        fromPieceId: '9',
        toPieceId: '3',
        status: 'accepted',
        requesterName: 'Miguel Torres',
        requesterEmail: 'miguel@example.com',
        message: 'Propuesta seria. Ambas monedas del continente americano, siglo XIX.',
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

let currentId = 11;

// Simulate network delay
const delay = (ms: number = 400) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAPI = {
    pieces: {
        getAll: async (): Promise<Piece[]> => {
            await delay();
            return [...pieces];
        },

        getById: async (id: string): Promise<Piece> => {
            await delay();
            const piece = pieces.find(p => p.id === id);
            if (!piece) throw new Error('Pieza no encontrada');
            return { ...piece };
        },

        create: async (data: CreatePieceDTO): Promise<Piece> => {
            await delay();
            validatePieceName(data.name);
            const newPiece: Piece = {
                id: (currentId++).toString(),
                ...data,
                availableForExchange: false,
                isTop: false,
                userId: 'user-1',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            pieces.push(newPiece);
            return { ...newPiece };
        },

        update: async (id: string, data: UpdatePieceDTO): Promise<Piece> => {
            await delay();
            if (data.name) {
                validatePieceName(data.name);
            }
            const index = pieces.findIndex(p => p.id === id);
            if (index === -1) throw new Error('Pieza no encontrada');
            pieces[index] = { ...pieces[index], ...data, updatedAt: new Date().toISOString() };
            return { ...pieces[index] };
        },

        delete: async (id: string): Promise<void> => {
            await delay();
            const exists = pieces.some(p => p.id === id);
            if (!exists) throw new Error('Pieza no encontrada');
            pieces = pieces.filter(p => p.id !== id);
            // Also remove related exchanges
            exchanges = exchanges.filter(e => e.fromPieceId !== id && e.toPieceId !== id);
        },

        toggleExchange: async (id: string, available: boolean): Promise<Piece> => {
            await delay();
            const index = pieces.findIndex(p => p.id === id);
            if (index === -1) throw new Error('Pieza no encontrada');
            pieces[index] = { ...pieces[index], availableForExchange: available, updatedAt: new Date().toISOString() };
            return { ...pieces[index] };
        },

        getTopByValue: async (limit = 5): Promise<Piece[]> => {
            await delay(300);
            return [...pieces]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, limit);
        },

        getSimilar: async (pieceId: string, limit = 4): Promise<Piece[]> => {
            await delay(300);
            const piece = pieces.find(p => p.id === pieceId);
            if (!piece) return [];
            const scored = pieces
                .filter(p => p.id !== pieceId)
                .map(p => {
                    let score = 0;
                    if (p.country === piece.country) score += 3;
                    if (p.type === piece.type) score += 2;
                    if (Math.abs(p.year - piece.year) <= 30) score += 2;
                    if (Math.abs(p.year - piece.year) <= 10) score += 1;
                    return { piece: p, score };
                })
                .sort((a, b) => b.score - a.score)
                .slice(0, limit)
                .map(s => s.piece);
            return scored;
        },
    },

    exchanges: {
        getAll: async (): Promise<ExchangeRequest[]> => {
            await delay();
            return [...exchanges];
        },

        getById: async (id: string): Promise<ExchangeRequest> => {
            await delay();
            const exchange = exchanges.find(e => e.id === id);
            if (!exchange) throw new Error('Solicitud no encontrada');
            return { ...exchange };
        },

        create: async (data: CreateExchangeRequestDTO): Promise<ExchangeRequest> => {
            await delay();
            const newExchange: ExchangeRequest = {
                id: `exc-${currentId++}`,
                fromUserId: 'user-visitor',
                ...data,
                status: 'pending',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            exchanges.push(newExchange);
            return { ...newExchange };
        },

        updateStatus: async (id: string, status: 'accepted' | 'rejected'): Promise<ExchangeRequest> => {
            await delay();
            const index = exchanges.findIndex(e => e.id === id);
            if (index === -1) throw new Error('Solicitud no encontrada');
            exchanges[index] = {
                ...exchanges[index],
                status,
                completedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            return { ...exchanges[index] };
        },

        sendCounterOffer: async (id: string, counterOffer: string): Promise<ExchangeRequest> => {
            await delay();
            const index = exchanges.findIndex(e => e.id === id);
            if (index === -1) throw new Error('Solicitud no encontrada');
            exchanges[index] = {
                ...exchanges[index],
                status: 'countered',
                counterOffer,
                updatedAt: new Date().toISOString(),
            };
            return { ...exchanges[index] };
        },

        respondToCounter: async (id: string, action: 'accept' | 'reject' | 'new', newMessage?: string): Promise<ExchangeRequest> => {
            await delay();
            const index = exchanges.findIndex(e => e.id === id);
            if (index === -1) throw new Error('Solicitud no encontrada');
            const newStatus: ExchangeStatus =
                action === 'accept' ? 'counter_accepted'
                : action === 'reject' ? 'counter_rejected'
                : 'countered';
            exchanges[index] = {
                ...exchanges[index],
                status: newStatus,
                counterResponse: newMessage || (action === 'accept' ? 'Contraoferta aceptada.' : 'Contraoferta rechazada.'),
                completedAt: action !== 'new' ? new Date().toISOString() : undefined,
                counterOffer: action === 'new' ? newMessage : exchanges[index].counterOffer,
                updatedAt: new Date().toISOString(),
            };
            return { ...exchanges[index] };
        },

        getHistory: async (): Promise<ExchangeRequest[]> => {
            await delay();
            const terminated: ExchangeStatus[] = ['accepted', 'rejected', 'counter_accepted', 'counter_rejected'];
            return exchanges.filter(e => terminated.includes(e.status));
        },
    },
};
