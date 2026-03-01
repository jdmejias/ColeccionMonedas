import { apiClient } from './api';
import type { Piece, CreatePieceDTO, UpdatePieceDTO } from '../shared/types';

export const piecesService = {
    getAll: async (): Promise<Piece[]> => {
        const res = await apiClient.get<Piece[]>('/pieces');
        return res.data;
    },

    getById: async (id: string): Promise<Piece> => {
        const res = await apiClient.get<Piece>(`/pieces/${id}`);
        return res.data;
    },

    create: async (data: CreatePieceDTO): Promise<Piece> => {
        const res = await apiClient.post<Piece>('/pieces', data);
        return res.data;
    },

    update: async (id: string, data: UpdatePieceDTO): Promise<Piece> => {
        const res = await apiClient.patch<Piece>(`/pieces/${id}`, data);
        return res.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/pieces/${id}`);
    },

    toggleExchange: async (id: string, available: boolean): Promise<Piece> => {
        const res = await apiClient.patch<Piece>(`/pieces/${id}/toggle-exchange`, { available });
        return res.data;
    },

    getTopByValue: async (limit = 5): Promise<Piece[]> => {
        const res = await apiClient.get<Piece[]>(`/pieces/top?limit=${limit}`);
        return res.data;
    },

    getSimilar: async (pieceId: string, limit = 4): Promise<Piece[]> => {
        const res = await apiClient.get<Piece[]>(`/pieces/${pieceId}/similar?limit=${limit}`);
        return res.data;
    },
};
