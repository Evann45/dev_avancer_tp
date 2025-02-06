import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreatePlayerDto } from './dto/create-player-dto';
export declare class PlayerService {
    private playerRepository;
    private eventEmitter;
    constructor(playerRepository: Repository<Player>, eventEmitter: EventEmitter2);
    findAll(): Promise<Player[]>;
    findOne(id: string, callback: (err: Error | null, player: Player | null) => void): void;
    create(player: CreatePlayerDto, callback: (err: Error | null, newPlayer: Player | null) => void): void;
    updateRank(id: string, newRank: number, callback: (err: Error | null) => void): void;
    remove(id: string, callback: (err: Error | null) => void): void;
}
