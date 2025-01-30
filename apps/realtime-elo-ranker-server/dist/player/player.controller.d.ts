import { PlayerService } from './player.service';
import { Player } from '../entities/player.entity';
import { CreatePlayerDto } from './dto/create-player-dto';
export declare class PlayerController {
    private readonly playerService;
    constructor(playerService: PlayerService);
    findAll(): Promise<Player[]>;
    findOne(id: string): Promise<Player>;
    create(createPlayerDto: CreatePlayerDto): Promise<Player>;
    remove(id: string): Promise<void>;
}
