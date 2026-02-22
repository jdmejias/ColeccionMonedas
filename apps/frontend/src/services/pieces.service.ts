import { mockAPI } from './mockAPI';
import type { Piece, CreatePieceDTO, UpdatePieceDTO } from '../shared/types';

// Use mock API in development
export const piecesService = {
    getAll: async (): Promise<Piece[]> => {
        return mockAPI.pieces.getAll();
    },

    getById: async (id: string): Promise<Piece> => {
        return mockAPI.pieces.getById(id);
    },

    create: async (data: CreatePieceDTO): Promise<Piece> => {
        return mockAPI.pieces.create(data);
    },

    update: async (id: string, data: UpdatePieceDTO): Promise<Piece> => {
        return mockAPI.pieces.update(id, data);
    },

    delete: async (id: string): Promise<void> => {
        return mockAPI.pieces.delete(id);
    },

    toggleExchange: async (id: string, available: boolean): Promise<Piece> => {
        return mockAPI.pieces.toggleExchange(id, available);
    },

    getTopByValue: async (limit = 5): Promise<Piece[]> => {
        return mockAPI.pieces.getTopByValue(limit);
    },

    getSimilar: async (pieceId: string, limit = 4): Promise<Piece[]> => {
        return mockAPI.pieces.getSimilar(pieceId, limit);
    },
};
