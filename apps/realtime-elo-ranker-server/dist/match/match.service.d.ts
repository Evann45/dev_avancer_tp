import { Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { PlayerService } from '../player/player.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class MatchService {
    private readonly matchRepository;
    private readonly playerService;
    private readonly eventEmitter;
    constructor(matchRepository: Repository<Match>, playerService: PlayerService, eventEmitter: EventEmitter2);
    findAll(): Promise<Match[]>;
    createMatch(match: CreateMatchDto, callback: (err: Error | null, newMatch: Match | null) => void): void;
    findOne(id: number, callback: (err: Error | null, match: Match | null) => void): void;
    calculateElo(winner: string, loser: string, callback: (err: Error | null, expectedScore: number | null) => void): void;
    updateRank(winner: string, loser: string, callback: (err: Error | null, winnerNewRank?: number, loserNewRank?: number) => void): void;
}
