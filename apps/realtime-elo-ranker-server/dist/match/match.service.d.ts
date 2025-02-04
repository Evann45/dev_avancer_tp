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
    createMatch(match: CreateMatchDto): Promise<Match>;
    findOne(id: number): Promise<Match | null>;
    calculateElo(winner: string, loser: string): Promise<number>;
    updateRank(winner: string, loser: string): Promise<void>;
}
