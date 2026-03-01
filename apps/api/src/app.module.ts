import { Module } from '@nestjs/common';
import { PiecesModule } from './pieces/pieces.module';
import { ExchangesModule } from './exchanges/exchanges.module';
import { CommentsModule } from './comments/comments.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [PiecesModule, ExchangesModule, CommentsModule, ProfileModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
