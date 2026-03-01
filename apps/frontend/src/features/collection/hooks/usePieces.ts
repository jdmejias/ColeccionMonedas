import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { piecesService } from '../../../services/pieces.service';
import type { CreatePieceDTO, UpdatePieceDTO } from '../../../shared/types';

export const usePieces = () => {
    return useQuery({
        queryKey: ['pieces'],
        queryFn: piecesService.getAll,
    });
};

export const usePiece = (id: string) => {
    return useQuery({
        queryKey: ['pieces', id],
        queryFn: () => piecesService.getById(id),
        enabled: !!id,
    });
};

export const useCreatePiece = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreatePieceDTO) => piecesService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pieces'] });
        },
    });
};

export const useUpdatePiece = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdatePieceDTO }) =>
            piecesService.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['pieces'] });
            queryClient.invalidateQueries({ queryKey: ['pieces', variables.id] });
        },
    });
};

export const useDeletePiece = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => piecesService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pieces'] });
        },
    });
};

export const useToggleExchange = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, available }: { id: string; available: boolean }) =>
            piecesService.toggleExchange(id, available),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['pieces'] });
            queryClient.invalidateQueries({ queryKey: ['pieces', variables.id] });
        },
    });
};

export const useToggleTop = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, isTop }: { id: string; isTop: boolean }) =>
            piecesService.toggleTop(id, isTop),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['pieces'] });
            queryClient.invalidateQueries({ queryKey: ['pieces', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['pieces', 'top'] });
        },
    });
};

export const useTopPieces = (limit = 5) => {
    return useQuery({
        queryKey: ['pieces', 'top', limit],
        queryFn: () => piecesService.getTopByValue(limit),
    });
};

export const useSimilarPieces = (pieceId: string, limit = 4) => {
    return useQuery({
        queryKey: ['pieces', 'similar', pieceId],
        queryFn: () => piecesService.getSimilar(pieceId, limit),
        enabled: !!pieceId,
    });
};
