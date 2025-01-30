import { Repository } from 'typeorm';
import { Player } from '../entities/player.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreatePlayerDto } from './dto/create-player-dto';
export declare class PlayerService {
    private playerRepository;
    private eventEmitter;
    constructor(playerRepository: Repository<Player>, eventEmitter: EventEmitter2);
    findAll(): Promise<Player[]>;
    findOne(id: string): Promise<Player>;
    create(createPlayerDto: CreatePlayerDto): Promise<Player>;
    remove(id: number): Promise<void>;
}
