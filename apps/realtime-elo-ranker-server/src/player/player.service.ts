import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../entities/player.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreatePlayerDto } from './dto/create-player-dto';


@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    private eventEmitter: EventEmitter2,
  ) {}

  findAll(): Promise<Player[]> {
    return this.playerRepository.find();
  }

  async findOne(id: string): Promise<Player> {
    const player = await this.playerRepository.findOneBy({ id });
    if (!player) {
      throw new Error(`Player with id ${id} not found`);
    }
    return player;
  }

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const player = new Player();
    player.id = createPlayerDto.id;
    player.rank = createPlayerDto.rank || 1000; // Set default rank to 1000 if not provided
    const newPlayer = await this.playerRepository.save(player);
    this.eventEmitter.emit('player.created', {
      player:{
        id: newPlayer.id,
        rank: newPlayer.rank
      }
    });
    return newPlayer;
  }

  async remove(id: number): Promise<void> {
    await this.playerRepository.delete(id);
  }

  
}