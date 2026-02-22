import { mockAPI } from './mockAPI';
import type { ExchangeRequest, CreateExchangeRequestDTO } from '../shared/types';

// Use mock API in development
export const exchangesService = {
    getAll: async (): Promise<ExchangeRequest[]> => {
        return mockAPI.exchanges.getAll();
    },

    getById: async (id: string): Promise<ExchangeRequest> => {
        return mockAPI.exchanges.getById(id);
    },

    create: async (data: CreateExchangeRequestDTO): Promise<ExchangeRequest> => {
        return mockAPI.exchanges.create(data);
    },

    updateStatus: async (
        id: string,
        status: 'accepted' | 'rejected'
    ): Promise<ExchangeRequest> => {
        return mockAPI.exchanges.updateStatus(id, status);
    },

    sendCounterOffer: async (id: string, counterOffer: string): Promise<ExchangeRequest> => {
        return mockAPI.exchanges.sendCounterOffer(id, counterOffer);
    },

    respondToCounter: async (
        id: string,
        action: 'accept' | 'reject' | 'new',
        newMessage?: string
    ): Promise<ExchangeRequest> => {
        return mockAPI.exchanges.respondToCounter(id, action, newMessage);
    },

    getHistory: async (): Promise<ExchangeRequest[]> => {
        return mockAPI.exchanges.getHistory();
    },
};
