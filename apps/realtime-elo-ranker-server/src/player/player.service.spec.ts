import { Test, TestingModule } from '@nestjs/testing';
import { PlayerService } from './player.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { CreatePlayerDto } from './dto/create-player-dto';

const moduleMocker = new ModuleMocker(global);

describe('PlayerService', () => {
  let service: PlayerService;
  let repository: jest.Mocked<Repository<Player>>;
  let eventEmitter: jest.Mocked<EventEmitter2>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PlayerService,
        {
          provide: getRepositoryToken(Player),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
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

    service = moduleRef.get(PlayerService);
    repository = moduleRef.get(getRepositoryToken(Player));
    eventEmitter = moduleRef.get(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of players', async () => {
      const players: Player[] = [{ id: '1', rank: 10 } as Player];
      repository.find.mockResolvedValue(players);

      await expect(service.findAll()).resolves.toEqual(players);
    });
  });

  describe('findOne', () => {
    it('should return a player if found', (done) => {
      const player: Player = { id: '1', rank: 10 } as Player;
      repository.findOneBy.mockResolvedValue(player);

      service.findOne('1', (err, result) => {
        expect(err).toBeNull();
        expect(result).toEqual(player);
        done();
      });
    });

    it('should return an error if player not found', (done) => {
      repository.findOneBy.mockResolvedValue(null);

      service.findOne('1', (err, result) => {
        expect(err).toBeInstanceOf(Error);
        expect(err?.message).toBe('Player with id 1 not found');
        expect(result).toBeNull();
        done();
      });
    });
  });

  describe('create', () => {
    it('should create and return a player', (done) => {
      const dto: CreatePlayerDto = { id:'1', rank: 5 };
      const savedPlayer: Player = { id: '1', rank: 5 } as Player;
      repository.save.mockResolvedValue(savedPlayer);

      service.create(dto, (err, result) => {
        expect(err).toBeNull();
        expect(result).toEqual(savedPlayer);
        expect(eventEmitter.emit).toHaveBeenCalledWith('player.created', expect.any(Object));
        done();
      });
    });
  });

  describe('updateRank', () => {
    it('should update the rank of a player', (done) => {
      repository.update.mockResolvedValue({ affected: 1 } as any);

      service.updateRank('1', 8, (err) => {
        expect(err).toBeNull();
        done();
      });
    });

    it('should return an error if no ID is provided', (done) => {
      service.updateRank('', 8, (err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err?.message).toBe('Player ID is required');
        done();
      });
    });
  });

  describe('remove', () => {
    it('should remove a player', (done) => {
      repository.delete.mockResolvedValue({ affected: 1 } as any);

      service.remove('1', (err) => {
        expect(err).toBeNull();
        done();
      });
    });
  });
});
