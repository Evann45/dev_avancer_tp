import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { Response } from 'express';
export declare class MatchController {
    private readonly matchService;
    constructor(matchService: MatchService);
    findAll(res: Response): void;
    findOne(id: number, res: Response): void;
    createMatch(createMatchDto: CreateMatchDto, res: Response): void;
}
