import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DEFAULT_PIECES } from './default-pieces';

const PIECE_NAME_REGEX =
    /^[A-Za-zÀ-ÿ]+(\s[A-Za-zÀ-ÿ.]+)*\s+[^\s]*[^\w\s][^\s]*\d+[^\s]*$|^[A-Za-zÀ-ÿ]+(\s[A-Za-zÀ-ÿ.]+)*\s+\d+[^\w\s][^\s]*$/;

function validatePieceName(name: string) {
    if (!PIECE_NAME_REGEX.test(name.trim())) {
        throw new BadRequestException(
            'El nombre debe incluir el nombre de la pieza y su denominación con símbolo de moneda. ' +
                'Formato: "Nombre Denominación" (Ej: "Peso Fuerte Argentino $1", "Morgan Dollar US$1")',
        );
    }
}

export interface CreatePieceDTO {
    name: string;
    type: string;
    country: string;
    year: number;
    conservationState: string;
    imageUrl: string;
    imageUrlBack?: string;
    description?: string;
}

export interface UpdatePieceDTO extends Partial<CreatePieceDTO> {
    availableForExchange?: boolean;
}

@Injectable()
export class PiecesService {
    constructor(private prisma: PrismaService) {}

    async getAll() {
        // Seed de seguridad: si faltan piezas de ejemplo, se insertan de forma idempotente.
        const existing = await this.prisma.piece.findMany({ select: { name: true } });
        const existingNames = new Set(existing.map((p) => p.name));
        const missing = DEFAULT_PIECES.filter((p) => !existingNames.has(p.name));

        if (missing.length > 0) {
            await this.prisma.piece.createMany({ data: missing });
        }

        return this.prisma.piece.findMany({ orderBy: { createdAt: 'desc' } });
    }

    async getById(id: string) {
        const piece = await this.prisma.piece.findUnique({ where: { id } });
        if (!piece) throw new NotFoundException('Pieza no encontrada');
        return piece;
    }

    async create(data: CreatePieceDTO, userId = 'user-1') {
        validatePieceName(data.name);
        return this.prisma.piece.create({
            data: {
                name: data.name.trim(),
                type: data.type,
                country: data.country.trim(),
                year: data.year,
                conservationState: data.conservationState,
                imageUrl: data.imageUrl.trim(),
                imageUrlBack: data.imageUrlBack?.trim() ?? '',
                description: data.description?.trim() ?? '',
                availableForExchange: false,
                userId,
            },
        });
    }

    async update(id: string, data: UpdatePieceDTO) {
        await this.getById(id);
        if (data.name) validatePieceName(data.name);
        return this.prisma.piece.update({
            where: { id },
            data: {
                ...(data.name !== undefined && { name: data.name.trim() }),
                ...(data.type !== undefined && { type: data.type }),
                ...(data.country !== undefined && { country: data.country.trim() }),
                ...(data.year !== undefined && { year: data.year }),
                ...(data.conservationState !== undefined && { conservationState: data.conservationState }),
                ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl.trim() }),
                ...(data.imageUrlBack !== undefined && { imageUrlBack: data.imageUrlBack.trim() }),
                ...(data.description !== undefined && { description: data.description.trim() }),
                ...(data.availableForExchange !== undefined && { availableForExchange: data.availableForExchange }),
            },
        });
    }

    async delete(id: string) {
        await this.getById(id);
        // Remove related exchanges first
        await this.prisma.exchangeRequest.deleteMany({
            where: { OR: [{ fromPieceId: id }, { toPieceId: id }] },
        });
        await this.prisma.piece.delete({ where: { id } });
    }

    async toggleExchange(id: string, available: boolean) {
        await this.getById(id);
        return this.prisma.piece.update({
            where: { id },
            data: { availableForExchange: available },
        });
    }

    async setTop(id: string, isTop: boolean) {
        const piece = await this.getById(id);

        if (isTop) {
            // If already top, nothing to do
            if (piece.isTop) return piece;

            const currentTopCount = await this.prisma.piece.count({ where: { isTop: true } });
            if (currentTopCount >= 5) {
                throw new BadRequestException('Solo se pueden seleccionar hasta 5 piezas para el Top Collection');
            }
        }

        return this.prisma.piece.update({
            where: { id },
            data: { isTop },
        });
    }

    getTopByValue(limit = 5) {
        // Now returns the pieces explicitly marcadas como Top
        return this.prisma.piece.findMany({
            where: { isTop: true },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }

    async getSimilar(pieceId: string, limit = 4) {
        const piece = await this.getById(pieceId);
        const candidates = await this.prisma.piece.findMany({
            where: { id: { not: pieceId } },
        });
        const scored = candidates
            .map((p) => {
                let score = 0;
                if (p.country === piece.country) score += 3;
                if (p.type === piece.type) score += 2;
                if (Math.abs(p.year - piece.year) <= 30) score += 2;
                if (Math.abs(p.year - piece.year) <= 10) score += 1;
                return { piece: p, score };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map((s) => s.piece);
        return scored;
    }
}
