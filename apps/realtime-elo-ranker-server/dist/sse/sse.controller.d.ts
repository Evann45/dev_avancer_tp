import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable } from 'rxjs';
export declare class SseController {
    private readonly eventEmitter;
    constructor(eventEmitter: EventEmitter2);
    sse(): Observable<MessageEvent>;
}
