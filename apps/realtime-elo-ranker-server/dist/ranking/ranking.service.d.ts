import { PlayerService } from '../player/player.service';
import { Player } from '../player/entities/player.entity';
export declare class RankingService {
    private readonly playerService;
    constructor(playerService: PlayerService);
    getRanking(callback: (err: Error | null, players: Player[] | null) => void): void;
}
