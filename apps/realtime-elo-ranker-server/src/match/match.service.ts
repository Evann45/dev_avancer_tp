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

  createMatch(match: CreateMatchDto, callback: (err: Error | null, newMatch: Match | null) => void): void {
    const draw = match.draw;
    this.playerService.findOne(match.winner, (err, winner) => {
      if (err || !winner) {
        return callback(new Error('Winner not found'), null);
      }
      this.playerService.findOne(match.loser, (err, loser) => {
        if (err || !loser) {
          return callback(new Error('Loser not found'), null);
        }
        this.updateRank(match.winner, match.loser, draw, (err, winnerNewRank, loserNewRank) => {
          if (err) {
            return callback(err, null);
          }
          if (winnerNewRank !== undefined) {
            winner.rank = winnerNewRank;
          }
          if (loserNewRank !== undefined) {
            loser.rank = loserNewRank;
          }
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
          this.matchRepository.save(match).then(newMatch => {
            callback(null, newMatch);
          }).catch(err => callback(err, null));
        });
      });
    });
  }

  findOne(id: number, callback: (err: Error | null, match: Match | null) => void): void {
    this.matchRepository.findOneBy({ id }).then(match => {
      if (!match) {
        return callback(new Error(`Match with id ${id} not found`), null);
      }
      callback(null, match);
    }).catch(err => callback(err, null));
  }

  calculateElo(winner: string, loser: string, callback: (err: Error | null, expectedScore: number | null) => void): void {
    this.playerService.findOne(winner, (err, winnerData) => {
      if (err || !winnerData) {
        return callback(new Error('Winner not found'), null);
      }
      this.playerService.findOne(loser, (err, loserData) => {
        if (err || !loserData) {
          return callback(new Error('Loser not found'), null);
        }
        const expectedScore = 1 / (1 + Math.pow(10, (loserData.rank - winnerData.rank) / 400));
        callback(null, expectedScore);
      });
    });
  }

  updateRank(winner: string, loser: string, isDraw: boolean, callback: (err: Error | null, winnerNewRank?: number, loserNewRank?: number) => void): void {
    const k = 32;
    this.playerService.findOne(winner, (err, winnerData) => {
      if (err || !winnerData) {
        return callback(new Error('Winner not found'));
      }
      this.playerService.findOne(loser, (err, loserData) => {
        if (err || !loserData) {
          return callback(new Error('Loser not found'));
        }
        this.calculateElo(winner, loser, (err, expectedScore) => {
          if (err || expectedScore === null) {
            return callback(err);
          }
          let winnerNewRank;
          let loserNewRank;

          if (isDraw) {
            winnerNewRank = Math.round(winnerData.rank + k * (0.5 - expectedScore));
            loserNewRank = Math.round(loserData.rank + k * (0.5 - expectedScore));
          } else {
            winnerNewRank = Math.round(winnerData.rank + k * (1 - expectedScore));
            loserNewRank = Math.round(loserData.rank + k * (0 - expectedScore));
          }

          // Ensure ranks are not negative
          if (winnerNewRank < 0) {
            winnerNewRank = 0;
          }
          if (loserNewRank < 0) {
            loserNewRank = 0;
          }

          this.playerService.updateRank(winner, winnerNewRank, (err) => {
            if (err) {
              return callback(err);
            }
            this.playerService.updateRank(loser, loserNewRank, (err) => {
              if (err) {
                return callback(err);
              }
              callback(null, winnerNewRank, loserNewRank);
            });
          });
        });
      });
    });
  }
}