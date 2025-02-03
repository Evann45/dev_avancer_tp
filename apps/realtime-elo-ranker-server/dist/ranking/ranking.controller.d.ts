import { RankingService } from './ranking.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable } from 'rxjs';
import { Player } from '../player/player.interface';
export declare class RankingController {
    private readonly rankingService;
    private readonly eventEmitter;
    constructor(rankingService: RankingService, eventEmitter: EventEmitter2);
    getRanking(): Promise<Player[]>;
    sse(): Observable<MessageEvent>;
}
