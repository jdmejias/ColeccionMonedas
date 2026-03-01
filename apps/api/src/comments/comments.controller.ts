import { Controller, Get, Post, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CommentsService } from './comments.service';
import type { CreateCommentDTO } from './comments.service';

@Controller('pieces/:pieceId/comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Get()
    getByPiece(@Param('pieceId') pieceId: string) {
        return this.commentsService.getByPiece(pieceId);
    }

    @Post()
    create(@Param('pieceId') pieceId: string, @Body() body: CreateCommentDTO) {
        return this.commentsService.create(pieceId, body);
    }

    @Delete(':commentId')
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param('commentId') commentId: string) {
        return this.commentsService.delete(commentId);
    }
}
