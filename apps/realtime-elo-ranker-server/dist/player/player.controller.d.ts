import { Response } from 'express';
import { PlayerService } from './player.service';
import { Player } from '../entities/player.entity';
import { CreatePlayerDto } from './dto/create-player-dto';
export declare class PlayerController {
    private readonly playerService;
    constructor(playerService: PlayerService);
    findAll(): Promise<Player[]>;
    findOne(id: string, res: Response): void;
    create(createPlayerDto: CreatePlayerDto, res: Response): void;
    remove(id: string, res: Response): void;
}
