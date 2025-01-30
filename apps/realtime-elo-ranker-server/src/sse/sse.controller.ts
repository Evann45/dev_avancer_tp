import { Controller, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, merge, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { Player} from '../player/player.interface';

@Controller('api/ranking')
export class SseController {
  constructor(private readonly eventEmitter: EventEmitter2) { }

  @Sse('events')
  sse(): Observable<MessageEvent> {
    // const playerCreated = fromEvent(this.eventEmitter, 'player.created').pipe(
    //   map((player: Player) => {
    //     return <MessageEvent>{
    //       data: {
    //         type: 'RankingUpdate',
    //         player,
    //       },
    //     };
    //   }),
    // );
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