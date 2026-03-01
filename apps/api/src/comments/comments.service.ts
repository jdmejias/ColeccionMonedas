import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

export interface CreateCommentDTO {
    authorName: string;
    text: string;
}

@Injectable()
export class CommentsService {
    constructor(private prisma: PrismaService) {}

    async getByPiece(pieceId: string) {
        const piece = await this.prisma.piece.findUnique({ where: { id: pieceId } });
        if (!piece) throw new NotFoundException('Pieza no encontrada');
        return this.prisma.comment.findMany({
            where: { pieceId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async create(pieceId: string, data: CreateCommentDTO) {
        const piece = await this.prisma.piece.findUnique({ where: { id: pieceId } });
        if (!piece) throw new NotFoundException('Pieza no encontrada');
        return this.prisma.comment.create({
            data: {
                pieceId,
                authorName: data.authorName.trim() || 'Visitante',
                text: data.text.trim(),
            },
        });
    }

    async delete(commentId: string) {
        const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
        if (!comment) throw new NotFoundException('Comentario no encontrado');
        return this.prisma.comment.delete({ where: { id: commentId } });
    }
}
