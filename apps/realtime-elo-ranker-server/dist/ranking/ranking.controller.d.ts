import { RankingService } from './ranking.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable } from 'rxjs';
import { Response } from 'express';
export declare class RankingController {
    private readonly rankingService;
    private readonly eventEmitter;
    constructor(rankingService: RankingService, eventEmitter: EventEmitter2);
    getRanking(res: Response): void;
    sse(): Observable<MessageEvent>;
}
