import { MatchService } from './match.service';
import { Match } from './entities/match.entity';
import { CreateMatchDto } from './dto/create-match.dto';
export declare class MatchController {
    private readonly matchService;
    constructor(matchService: MatchService);
    findAll(): Promise<Match[]>;
    findOne(id: number): Promise<Match | null>;
    create(match: CreateMatchDto): Promise<any>;
}
