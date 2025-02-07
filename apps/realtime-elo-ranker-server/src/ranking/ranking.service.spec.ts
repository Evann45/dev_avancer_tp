import { Test, TestingModule } from '@nestjs/testing';
import { RankingService } from './ranking.service';
import { PlayerService } from '../player/player.service';
import { Player } from '../player/entities/player.entity';

describe('RankingService', () => {
  let service: RankingService;
  let playerService: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RankingService,
        {
          provide: PlayerService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RankingService>(RankingService);
    playerService = module.get<PlayerService>(PlayerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRanking', () => {
    it('should return a sorted list of players by rank', async () => {
      const players: Player[] = [
        { id: '1', name: 'Alice', rank: 100 } as Player,
        { id: '2', name: 'Bob', rank: 200 } as Player,
        { id: '3', name: 'Charlie', rank: 150 } as Player,
      ];
      
      jest.spyOn(playerService, 'findAll').mockResolvedValue(players);

      await new Promise((resolve) => {
        service.getRanking((err, result) => {
          expect(err).toBeNull();
          expect(result).toEqual([
            { id: '2', name: 'Bob', rank: 200 },
            { id: '3', name: 'Charlie', rank: 150 },
            { id: '1', name: 'Alice', rank: 100 },
          ]);
          resolve(true);
        });
      });
    });

    it('should handle errors from playerService', async () => {
      const error = new Error('Database error');
      jest.spyOn(playerService, 'findAll').mockRejectedValue(error);

      await new Promise((resolve) => {
        service.getRanking((err, result) => {
          expect(err).toEqual(error);
          expect(result).toBeNull();
          resolve(true);
        });
      });
    });
  });
});