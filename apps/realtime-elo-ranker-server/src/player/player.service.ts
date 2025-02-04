import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
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

  findOne(id: string, callback: (err: Error | null, player: Player | null) => void): void {
    this.playerRepository.findOneBy({ id }).then(player => {
      if (!player) {
        return callback(new Error(`Player with id ${id} not found`), null);
      }
      callback(null, player);
    }).catch(err => callback(err, null));
  }

  create(createPlayerDto: CreatePlayerDto, callback: (err: Error | null, newPlayer: Player | null) => void): void {
    if (createPlayerDto === null || createPlayerDto === undefined) {
      return callback(new Error('User is null or undefined'), null);
    }
    if (createPlayerDto.rank === null || createPlayerDto.rank === undefined) {
      // Fais la moyenne des rank de tous les joueurs
      this.findAll().then(players => {
        let rank = players.reduce((acc, p) => acc + p.rank, 0) / players.length;
        rank = Math.round(rank);
        createPlayerDto.rank = rank;

        this.playerRepository.save(createPlayerDto).then(newPlayer => {
          this.eventEmitter.emit('player.created', {
            player: {
              id: newPlayer.id,
              rank: newPlayer.rank,
            },
          });
          callback(null, newPlayer);
        }).catch(err => callback(err, null));
      }).catch(err => callback(err, null));
    } else {
      this.playerRepository.save(createPlayerDto).then(newPlayer => {
        this.eventEmitter.emit('player.created', {
          player: {
            id: newPlayer.id,
            rank: newPlayer.rank,
          },
        });
        callback(null, newPlayer);
      }).catch(err => callback(err, null));
    }
  }

  remove(id: string, callback: (err: Error | null) => void): void {
    this.playerRepository.delete({ id }).then(() => {
      callback(null);
    }).catch(err => callback(err));
  }

  updateRank(id: string, newRank: number, callback: (err: Error | null) => void): void {
    this.playerRepository.update(id, { rank: newRank }).then(() => {
      callback(null);
    }).catch(err => callback(err));
  }

}