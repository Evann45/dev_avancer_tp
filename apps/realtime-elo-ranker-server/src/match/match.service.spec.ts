import { Test, TestingModule } from '@nestjs/testing';
import { MatchService } from './match.service';
import { PlayerService } from '../player/player.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('MatchService', () => {
  let service: MatchService;
  let matchRepository: Repository<Match>;
  let playerService: PlayerService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchService,
        {
          provide: getRepositoryToken(Match),
          useClass: Repository,
        },
        {
          provide: PlayerService,
          useValue: {
            findOne: jest.fn(),
            updateRank: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MatchService>(MatchService);
    matchRepository = module.get<Repository<Match>>(getRepositoryToken(Match));
    playerService = module.get<PlayerService>(PlayerService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all matches', async () => {
    const matches = [
      { id: 1, winner: 'player1', loser: 'player2', draw: false },
      { id: 2, winner: 'player3', loser: 'player4', draw: false }
    ];
    jest.spyOn(matchRepository, 'find').mockResolvedValue(matches);
    expect(await service.findAll()).toBe(matches);
  });

  it('should create a match', (done) => {
    const matchDto = { winner: 'player1', loser: 'player2', draw: false };
    const savedMatch = { id: 1, ...matchDto };
  
    jest.spyOn(matchRepository, 'save').mockResolvedValue(savedMatch);
    jest.spyOn(playerService, 'findOne').mockImplementation((id, callback) => {
      callback(null, { id, rank: 1000 });
    });
    jest.spyOn(playerService, 'updateRank').mockImplementation((id, rank, callback) => {
      callback(null);
    });
    jest.spyOn(eventEmitter, 'emit').mockImplementation(() => true);
  
    service.createMatch(matchDto, (err, result) => {
      expect(err).toBeNull();
      expect(result).toEqual(savedMatch);
      done(); // Marque le test comme terminé
    });
  });
  

  it('should find a match by ID', async () => {
    const match = { id: 1, winner: 'player1', loser: 'player2', draw: false };
    jest.spyOn(matchRepository, 'findOneBy').mockResolvedValue(match);
    await new Promise((resolve) => {
      service.findOne(1, (err, result) => {
        expect(err).toBeNull();
        expect(result).toEqual(match);
        resolve(true);
      });
    });
  });

  it('should calculate Elo rating', async () => {
    const winner = { id: 'player1', rank: 1500 };
    const loser = { id: 'player2', rank: 1400 };
    jest.spyOn(playerService, 'findOne').mockImplementation((id, cb) => {
      if (id === 'player1') cb(null, winner);
      else cb(null, loser);
    });

    await new Promise((resolve) => {
      service.calculateElo('player1', 'player2', (err, expectedScore) => {
        expect(err).toBeNull();
        expect(expectedScore).toBeCloseTo(0.64, 2);
        resolve(true);
      });
    });
  });
});
