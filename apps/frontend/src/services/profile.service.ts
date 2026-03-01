import { apiClient } from './api';
import type { UserProfile } from '../shared/types';

export const profileService = {
    get: async (userId: string): Promise<UserProfile> => {
        const res = await apiClient.get<UserProfile>(`/profile/${userId}`);
        return res.data;
    },

    update: async (userId: string, data: Partial<UserProfile>): Promise<UserProfile> => {
        const res = await apiClient.put<UserProfile>(`/profile/${userId}`, data);
        return res.data;
    },
};
