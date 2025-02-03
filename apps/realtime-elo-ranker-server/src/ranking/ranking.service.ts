import { Injectable } from '@nestjs/common';
import { PlayerService } from 'src/player/player.service';
import { Player } from 'src/player/entities/player.entity';

@Injectable()
export class RankingService {
  constructor(private readonly playerService: PlayerService) {}
  
  async getRanking(): Promise<Player[]> {
    const players = await this.playerService.findAll();
    return players.sort((a, b) => a.rank - b.rank);
  }
}
