import {
    Controller, Get, Post, Patch, Delete,
    Param, Body, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { PiecesService } from './pieces.service';
import type { CreatePieceDTO, UpdatePieceDTO } from './pieces.service';

@Controller('pieces')
export class PiecesController {
    constructor(private readonly piecesService: PiecesService) {}

    @Get()
    getAll() {
        return this.piecesService.getAll();
    }

    // NOTE: 'top' and ':id/similar' must come before ':id' to avoid route conflicts
    @Get('top')
    getTopByValue(@Query('limit') limit?: string) {
        return this.piecesService.getTopByValue(limit ? parseInt(limit) : 5);
    }

    @Get(':id')
    getById(@Param('id') id: string) {
        return this.piecesService.getById(id);
    }

    @Get(':id/similar')
    getSimilar(@Param('id') id: string, @Query('limit') limit?: string) {
        return this.piecesService.getSimilar(id, limit ? parseInt(limit) : 4);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() body: CreatePieceDTO) {
        return this.piecesService.create(body);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body: UpdatePieceDTO) {
        return this.piecesService.update(id, body);
    }

    @Patch(':id/top')
    setTop(
        @Param('id') id: string,
        @Body('isTop') isTop: boolean,
    ) {
        return this.piecesService.setTop(id, isTop);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param('id') id: string) {
        return this.piecesService.delete(id);
    }

    @Patch(':id/toggle-exchange')
    toggleExchange(
        @Param('id') id: string,
        @Body('available') available: boolean,
    ) {
        return this.piecesService.toggleExchange(id, available);
    }
}
