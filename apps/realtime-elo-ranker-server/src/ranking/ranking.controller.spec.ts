import { Test, TestingModule } from '@nestjs/testing';
import { RankingController } from './ranking.controller';
import { RankingService } from './ranking.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Player } from '../player/entities/player.entity';

describe('RankingController', () => {
  let controller: RankingController;
  let service: RankingService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RankingController],
      providers: [
        {
          provide: RankingService,
          useValue: {
            getRanking: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
            on: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RankingController>(RankingController);
    service = module.get<RankingService>(RankingService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getRanking', () => {
    it('should return ranking of players', async () => {
      const mockPlayers: Player[] = [
        { id: '1', name: 'Player1', rank: 2000 } as Player,
        { id: '2', name: 'Player2', rank: 1900 } as Player,
      ];

      jest.spyOn(service, 'getRanking').mockImplementation((callback) => {
        callback(null, mockPlayers);
      });

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      controller.getRanking(res as any);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPlayers);
    });

    it('should return an error if ranking fails', async () => {
      const mockError = new Error('Database error');

      jest.spyOn(service, 'getRanking').mockImplementation((callback) => {
        callback(mockError, null);
      });

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      controller.getRanking(res as any);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: mockError.message });
    });
  });

  describe('sse', () => {
    it('should return an observable for SSE events', (done) => {
      const eventData = { player: { id: '1', name: 'Player1', rank: 2000 } as Player };
      
      // Simuler l'émission d'un événement
      eventEmitter.emit('player.created', eventData);
      
      const observable = controller.sse();
      const subscription = observable.subscribe((event) => {
        expect(event).toEqual({
          data: {
            type: 'RankingUpdate',
            player: eventData.player,
          },
        });
        subscription.unsubscribe();
        done();
      });
    });
  });
});
