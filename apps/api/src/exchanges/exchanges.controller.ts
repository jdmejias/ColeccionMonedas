import {
    Controller, Get, Post, Patch,
    Param, Body, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ExchangesService } from './exchanges.service';
import type { CreateExchangeDTO } from './exchanges.service';

@Controller('exchanges')
export class ExchangesController {
    constructor(private readonly exchangesService: ExchangesService) {}

    @Get()
    getAll() {
        return this.exchangesService.getAll();
    }

    // NOTE: 'history' must come before ':id' to avoid route conflicts
    @Get('history')
    getHistory() {
        return this.exchangesService.getHistory();
    }

    @Get(':id')
    getById(@Param('id') id: string) {
        return this.exchangesService.getById(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() body: CreateExchangeDTO) {
        return this.exchangesService.create(body);
    }

    @Patch(':id/status')
    updateStatus(
        @Param('id') id: string,
        @Body('status') status: 'accepted' | 'rejected',
    ) {
        return this.exchangesService.updateStatus(id, status);
    }

    @Patch(':id/counter-offer')
    sendCounterOffer(
        @Param('id') id: string,
        @Body('counterOffer') counterOffer: string,
    ) {
        return this.exchangesService.sendCounterOffer(id, counterOffer);
    }

    @Patch(':id/counter-response')
    respondToCounter(
        @Param('id') id: string,
        @Body('action') action: 'accept' | 'reject' | 'new',
        @Body('message') message?: string,
    ) {
        return this.exchangesService.respondToCounter(id, action, message);
    }
}
