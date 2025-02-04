import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { PlayerService } from '../player/player.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    private readonly playerService: PlayerService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  findAll(): Promise<Match[]> {
    return this.matchRepository.find();
  }

  async createMatch(match: CreateMatchDto): Promise<Match> {
    // Verif de l'existance des joueurs
    const winner = await this.playerService.findOne(match.winner);
    const loser = await this.playerService.findOne(match.loser);
    if (winner === null || loser === null) {
      throw new Error('Winner or loser not found');
    }
    await this.updateRank(match.winner, match.loser);
    this.eventEmitter.emit('match.result', {
      player: {
        id: winner.id,
        rank: winner.rank,
      },
    });
    this.eventEmitter.emit('match.result', {
      player: {
        id: loser.id,
        rank: loser.rank,
      },
    });
    return this.matchRepository.save(match);
  }

  async findOne(id: number): Promise<Match | null> {
    return this.matchRepository.findOneBy({ id });
  }

  async calculateElo(winner: string, loser: string) {
    const winnerData = await this.playerService.findOne(winner);
    const loserData = await this.playerService.findOne(loser);

    if (!winnerData || !loserData) {
      throw new Error('Player not found');
    }
    return 1 / (1 + Math.pow(10, (loserData.rank - winnerData.rank) / 400));
  }

  async updateRank(winner: string, loser: string) {
    const k = 32;
    const winnerData = await this.playerService.findOne(winner);
    const loserData = await this.playerService.findOne(loser);

    if (!winnerData || !loserData) {
      throw new Error('Player not found');
    }
    const expectedScore = await this.calculateElo(winner, loser);
    const winnerNewRank = winnerData.rank + k * (1 - expectedScore);
    const loserNewRank = loserData.rank + k * (0 - expectedScore);

    await this.playerService.updateRank(winner, winnerNewRank);
    await this.playerService.updateRank(loser, loserNewRank);
  }
}