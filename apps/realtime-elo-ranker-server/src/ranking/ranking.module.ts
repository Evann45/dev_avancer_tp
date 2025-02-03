import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '../player/entities/player.entity';
import { RankingService } from './ranking.service';
import { RankingController } from './ranking.controller';
import { PlayerModule } from 'src/player/player.module';

@Module({
  imports: [TypeOrmModule.forFeature([Player]), PlayerModule],
  providers: [RankingService],
  controllers: [RankingController],
  exports: [RankingService], // Export RankingService
})
export class RankingModule {}