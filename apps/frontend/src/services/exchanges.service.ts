import { apiClient } from './api';
import type { ExchangeRequest, CreateExchangeRequestDTO } from '../shared/types';

export const exchangesService = {
    getAll: async (): Promise<ExchangeRequest[]> => {
        const res = await apiClient.get<ExchangeRequest[]>('/exchanges');
        return res.data;
    },

    getById: async (id: string): Promise<ExchangeRequest> => {
        const res = await apiClient.get<ExchangeRequest>(`/exchanges/${id}`);
        return res.data;
    },

    create: async (data: CreateExchangeRequestDTO): Promise<ExchangeRequest> => {
        const res = await apiClient.post<ExchangeRequest>('/exchanges', data);
        return res.data;
    },

    updateStatus: async (
        id: string,
        status: 'accepted' | 'rejected',
    ): Promise<ExchangeRequest> => {
        const res = await apiClient.patch<ExchangeRequest>(`/exchanges/${id}/status`, { status });
        return res.data;
    },

    sendCounterOffer: async (id: string, counterOffer: string): Promise<ExchangeRequest> => {
        const res = await apiClient.patch<ExchangeRequest>(`/exchanges/${id}/counter-offer`, { counterOffer });
        return res.data;
    },

    respondToCounter: async (
        id: string,
        action: 'accept' | 'reject' | 'new',
        newMessage?: string,
    ): Promise<ExchangeRequest> => {
        const res = await apiClient.patch<ExchangeRequest>(`/exchanges/${id}/counter-response`, {
            action,
            message: newMessage,
        });
        return res.data;
    },

    getHistory: async (): Promise<ExchangeRequest[]> => {
        const res = await apiClient.get<ExchangeRequest[]>('/exchanges/history');
        return res.data;
    },
};
