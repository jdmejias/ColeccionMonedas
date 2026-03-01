import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../../../services/profile.service';
import type { UserProfile } from '../../../shared/types';

export const useProfile = (userId: string) => {
    return useQuery({
        queryKey: ['profile', userId],
        queryFn: () => profileService.get(userId),
        enabled: !!userId,
    });
};

export const useUpdateProfile = (userId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<UserProfile>) => profileService.update(userId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile', userId] });
        },
    });
};
