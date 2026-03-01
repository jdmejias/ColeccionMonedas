import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsService } from '../../../services/comments.service';

export const useComments = (pieceId: string) => {
    return useQuery({
        queryKey: ['comments', pieceId],
        queryFn: () => commentsService.getByPiece(pieceId),
        enabled: !!pieceId,
    });
};

export const useAddComment = (pieceId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ authorName, text }: { authorName: string; text: string }) =>
            commentsService.create(pieceId, authorName, text),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', pieceId] });
        },
    });
};

export const useDeleteComment = (pieceId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (commentId: string) => commentsService.delete(pieceId, commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', pieceId] });
        },
    });
};
