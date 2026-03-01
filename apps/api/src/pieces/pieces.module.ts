import { Module } from '@nestjs/common';
import { PiecesController } from './pieces.controller';
import { PiecesService } from './pieces.service';
import { PrismaService } from '../prisma.service';

@Module({
    controllers: [PiecesController],
    providers: [PiecesService, PrismaService],
    exports: [PrismaService],
})
export class PiecesModule {}
