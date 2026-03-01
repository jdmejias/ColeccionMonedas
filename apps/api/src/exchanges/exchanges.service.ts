import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

export interface CreateExchangeDTO {
    fromPieceId: string;
    toPieceId: string;
    toUserId: string;
    requesterName: string;
    requesterEmail: string;
    message?: string;
}

type ExchangeStatus =
    | 'pending'
    | 'accepted'
    | 'rejected'
    | 'countered'
    | 'counter_accepted'
    | 'counter_rejected';

const TERMINATED: ExchangeStatus[] = ['accepted', 'rejected', 'counter_accepted', 'counter_rejected'];

@Injectable()
export class ExchangesService {
    constructor(private prisma: PrismaService) {}

    getAll() {
        return this.prisma.exchangeRequest.findMany({ orderBy: { createdAt: 'desc' } });
    }

    async getById(id: string) {
        const ex = await this.prisma.exchangeRequest.findUnique({ where: { id } });
        if (!ex) throw new NotFoundException('Solicitud no encontrada');
        return ex;
    }

    create(data: CreateExchangeDTO, fromUserId = 'user-visitor') {
        return this.prisma.exchangeRequest.create({
            data: {
                fromUserId,
                toUserId: data.toUserId,
                fromPieceId: data.fromPieceId,
                toPieceId: data.toPieceId,
                requesterName: data.requesterName,
                requesterEmail: data.requesterEmail,
                message: data.message,
                status: 'pending',
            },
        });
    }

    async updateStatus(id: string, status: 'accepted' | 'rejected') {
        await this.getById(id);
        return this.prisma.exchangeRequest.update({
            where: { id },
            data: { status, completedAt: new Date() },
        });
    }

    async sendCounterOffer(id: string, counterOffer: string) {
        await this.getById(id);
        return this.prisma.exchangeRequest.update({
            where: { id },
            data: { status: 'countered', counterOffer },
        });
    }

    async respondToCounter(
        id: string,
        action: 'accept' | 'reject' | 'new',
        newMessage?: string,
    ) {
        await this.getById(id);
        const newStatus: ExchangeStatus =
            action === 'accept'
                ? 'counter_accepted'
                : action === 'reject'
                  ? 'counter_rejected'
                  : 'countered';
        return this.prisma.exchangeRequest.update({
            where: { id },
            data: {
                status: newStatus,
                counterResponse:
                    newMessage ||
                    (action === 'accept' ? 'Contraoferta aceptada.' : 'Contraoferta rechazada.'),
                completedAt: action !== 'new' ? new Date() : null,
                ...(action === 'new' && newMessage ? { counterOffer: newMessage } : {}),
            },
        });
    }

    getHistory() {
        return this.prisma.exchangeRequest.findMany({
            where: { status: { in: TERMINATED } },
            orderBy: { updatedAt: 'desc' },
        });
    }
}
