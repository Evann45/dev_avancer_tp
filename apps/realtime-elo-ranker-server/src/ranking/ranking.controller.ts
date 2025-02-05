import { Controller, Get, Sse, Res } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, merge, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { Player} from '../player/player.interface';
import { Response } from 'express';

@Controller('api/ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService,
              private readonly eventEmitter: EventEmitter2) {}

  @Get()
  getRanking(@Res() res: Response): void {
    this.rankingService.getRanking((err, players) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      res.status(200).json(players);
    });
  }

  

  @Sse('events')
  sse(): Observable<MessageEvent> {
    const playerCreated = fromEvent(this.eventEmitter, 'player.created').pipe(
      map((event: {player: Player}) => {
        return <MessageEvent>{
          data: {
            type: 'RankingUpdate',
            player: event.player,
          }
        }
      }),
    );

    const matchResult = fromEvent(this.eventEmitter, 'match.result').pipe(
      map((event: { player: Player }) => {
      return <MessageEvent>{
        data: {
        type: 'RankingUpdate',
        player: event.player,
        }
      }
      }),
    );

    return merge(matchResult, playerCreated);
  }
}