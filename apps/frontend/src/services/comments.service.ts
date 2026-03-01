import { apiClient } from './api';
import type { Comment } from '../shared/types';

export const commentsService = {
    getByPiece: async (pieceId: string): Promise<Comment[]> => {
        const res = await apiClient.get<Comment[]>(`/pieces/${pieceId}/comments`);
        return res.data;
    },

    create: async (pieceId: string, authorName: string, text: string): Promise<Comment> => {
        const res = await apiClient.post<Comment>(`/pieces/${pieceId}/comments`, { authorName, text });
        return res.data;
    },

    delete: async (pieceId: string, commentId: string): Promise<void> => {
        await apiClient.delete(`/pieces/${pieceId}/comments/${commentId}`);
    },
};
