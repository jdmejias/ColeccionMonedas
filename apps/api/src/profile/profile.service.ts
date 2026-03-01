import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

export interface UpsertProfileDTO {
    name?: string;
    photoUrl?: string;
    bio?: string;
}

@Injectable()
export class ProfileService {
    constructor(private prisma: PrismaService) {}

    async get(userId: string) {
        const profile = await this.prisma.userProfile.findUnique({ where: { userId } });
        if (!profile) {
            // Return default if not exists
            return { userId, name: 'Coleccionista', photoUrl: '', bio: '' };
        }
        return profile;
    }

    async upsert(userId: string, data: UpsertProfileDTO) {
        return this.prisma.userProfile.upsert({
            where: { userId },
            create: {
                userId,
                name: data.name ?? 'Coleccionista',
                photoUrl: data.photoUrl ?? '',
                bio: data.bio ?? '',
            },
            update: {
                ...(data.name !== undefined && { name: data.name }),
                ...(data.photoUrl !== undefined && { photoUrl: data.photoUrl }),
                ...(data.bio !== undefined && { bio: data.bio }),
            },
        });
    }
}
