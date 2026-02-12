import type { Piece, CreatePieceDTO, UpdatePieceDTO, ExchangeRequest, CreateExchangeRequestDTO } from '../shared/types';

// In-memory storage
let pieces: Piece[] = [
    {
        id: '1',
        name: 'Moneda de 1 Peso Argentino 1985',
        type: 'Moneda',
        country: 'Argentina',
        year: 1985,
        conservationState: 'Muy Bueno',
        estimatedValue: 15.50,
        imageUrl: 'https://images.unsplash.com/photo-1621762389513-6587d02c39a8?w=400&h=300&fit=crop',
        description: 'Moneda histórica argentina en excelente estado de conservación',
        availableForExchange: true,
        userId: 'user-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '2',
        name: 'Billete de 100 Pesos Mexicanos',
        type: 'Billete',
        country: 'México',
        year: 2019,
        conservationState: 'Excelente',
        estimatedValue: 50.00,
        imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400&h=300&fit=crop',
        description: 'Billete conmemorativo en perfecto estado',
        availableForExchange: false,
        userId: 'user-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '3',
        name: 'Moneda de 1 Dólar USA 1921',
        type: 'Moneda',
        country: 'Estados Unidos',
        year: 1921,
        conservationState: 'Bueno',
        estimatedValue: 120.00,
        imageUrl: 'https://images.unsplash.com/photo-1621416894569-59a5b2d85128?w=400&h=300&fit=crop',
        description: 'Dólar Morgan de plata, pieza de colección',
        availableForExchange: true,
        userId: 'user-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

let exchanges: ExchangeRequest[] = [];

let currentId = 4;

// Simulate network delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAPI = {
    pieces: {
        getAll: async (): Promise<Piece[]> => {
            await delay();
            return [...pieces];
        },

        getById: async (id: string): Promise<Piece> => {
            await delay();
            const piece = pieces.find(p => p.id === id);
            if (!piece) throw new Error('Piece not found');
            return piece;
        },

        create: async (data: CreatePieceDTO): Promise<Piece> => {
            await delay();
            const newPiece: Piece = {
                id: (currentId++).toString(),
                ...data,
                availableForExchange: false,
                userId: 'user-1',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            pieces.push(newPiece);
            return newPiece;
        },

        update: async (id: string, data: UpdatePieceDTO): Promise<Piece> => {
            await delay();
            const index = pieces.findIndex(p => p.id === id);
            if (index === -1) throw new Error('Piece not found');

            pieces[index] = {
                ...pieces[index],
                ...data,
                updatedAt: new Date().toISOString(),
            };
            return pieces[index];
        },

        delete: async (id: string): Promise<void> => {
            await delay();
            pieces = pieces.filter(p => p.id !== id);
        },

        toggleExchange: async (id: string, available: boolean): Promise<Piece> => {
            await delay();
            const index = pieces.findIndex(p => p.id === id);
            if (index === -1) throw new Error('Piece not found');

            pieces[index] = {
                ...pieces[index],
                availableForExchange: available,
                updatedAt: new Date().toISOString(),
            };
            return pieces[index];
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
            if (!exchange) throw new Error('Exchange request not found');
            return exchange;
        },

        create: async (data: CreateExchangeRequestDTO): Promise<ExchangeRequest> => {
            await delay();
            const newExchange: ExchangeRequest = {
                id: (currentId++).toString(),
                fromUserId: 'user-1',
                ...data,
                status: 'pending',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            exchanges.push(newExchange);
            return newExchange;
        },

        updateStatus: async (id: string, status: 'accepted' | 'rejected'): Promise<ExchangeRequest> => {
            await delay();
            const index = exchanges.findIndex(e => e.id === id);
            if (index === -1) throw new Error('Exchange request not found');

            exchanges[index] = {
                ...exchanges[index],
                status,
                updatedAt: new Date().toISOString(),
            };
            return exchanges[index];
        },
    },
};
