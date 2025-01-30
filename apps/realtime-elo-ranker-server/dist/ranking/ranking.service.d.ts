import { CreateRankingDto } from './dto/create-ranking.dto';
import { UpdateRankingDto } from './dto/update-ranking.dto';
export declare class RankingService {
    create(createRankingDto: CreateRankingDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateRankingDto: UpdateRankingDto): string;
    remove(id: number): string;
}
