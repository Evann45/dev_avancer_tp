import { Injectable } from '@nestjs/common';
import { PlayerService } from '../player/player.service';
import { Player } from '../player/entities/player.entity';

@Injectable()
export class RankingService {
  constructor(private readonly playerService: PlayerService) {}
  
  getRanking(callback: (err: Error | null, players: Player[] | null) => void): void {
    this.playerService.findAll().then(players => {
      const sortedPlayers = players.sort((a, b) => b.rank - a.rank);
      callback(null, sortedPlayers);
    }).catch(err => callback(err, null));
  }
}
