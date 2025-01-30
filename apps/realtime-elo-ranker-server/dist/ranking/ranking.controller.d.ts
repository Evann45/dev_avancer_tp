import { RankingService } from './ranking.service';
import { CreateRankingDto } from './dto/create-ranking.dto';
import { UpdateRankingDto } from './dto/update-ranking.dto';
export declare class RankingController {
    private readonly rankingService;
    constructor(rankingService: RankingService);
    create(createRankingDto: CreateRankingDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateRankingDto: UpdateRankingDto): string;
    remove(id: string): string;
}
