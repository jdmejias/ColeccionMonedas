import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { exchangesService } from '../../../services/exchanges.service';
import type { CreateExchangeRequestDTO } from '../../../shared/types';

export const useExchanges = () => {
    return useQuery({
        queryKey: ['exchanges'],
        queryFn: exchangesService.getAll,
    });
};

export const useExchange = (id: string) => {
    return useQuery({
        queryKey: ['exchanges', id],
        queryFn: () => exchangesService.getById(id),
        enabled: !!id,
    });
};

export const useExchangeHistory = () => {
    return useQuery({
        queryKey: ['exchanges', 'history'],
        queryFn: exchangesService.getHistory,
    });
};

export const useCreateExchange = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateExchangeRequestDTO) => exchangesService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exchanges'] });
        },
    });
};

export const useUpdateExchangeStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: 'accepted' | 'rejected' }) =>
            exchangesService.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exchanges'] });
        },
    });
};

export const useSendCounterOffer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, counterOffer }: { id: string; counterOffer: string }) =>
            exchangesService.sendCounterOffer(id, counterOffer),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exchanges'] });
        },
    });
};

export const useRespondToCounter = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            id,
            action,
            newMessage,
        }: {
            id: string;
            action: 'accept' | 'reject' | 'new';
            newMessage?: string;
        }) => exchangesService.respondToCounter(id, action, newMessage),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exchanges'] });
        },
    });
};

