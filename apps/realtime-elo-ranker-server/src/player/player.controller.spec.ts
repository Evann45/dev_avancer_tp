import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player-dto';
import { Player } from './entities/player.entity';
import { Response } from 'express';

describe('PlayerController', () => {
  let controller: PlayerController;
  let service: PlayerService;
  let mockResponse: Partial<Response>;

  beforeEach(async () => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [
        {
          provide: PlayerService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PlayerController>(PlayerController);
    service = module.get<PlayerService>(PlayerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of players', async () => {
      const players: Player[] = [{ id: '1', rank: 10 } as Player];
      jest.spyOn(service, 'findAll').mockResolvedValue(players);
      await expect(controller.findAll()).resolves.toEqual(players);
    });
  });

  describe('findOne', () => {
    it('should return a player if found', () => {
      const player: Player = { id: '1', rank: 10 } as Player;
      jest.spyOn(service, 'findOne').mockImplementation((id, callback) => callback(null, player));

      controller.findOne('1', mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(player);
    });

    it('should return 404 if player not found', () => {
      jest.spyOn(service, 'findOne').mockImplementation((id, callback) => callback(new Error('Player not found'), null));

      controller.findOne('1', mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Player not found' });
    });
  });

  describe('create', () => {
    it('should create a player', () => {
      const createPlayerDto: CreatePlayerDto = { id: '1', rank: 1000 };
      const newPlayer: Player = { id: '1', rank: 1000 } as Player;
      jest.spyOn(service, 'create').mockImplementation((dto, callback) => callback(null, newPlayer));

      controller.create(createPlayerDto, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(newPlayer);
    });

    it('should return 500 on error', () => {
      jest.spyOn(service, 'create').mockImplementation((dto, callback) => callback(new Error('Error creating player'), null));

      controller.create({ id: '1', rank: 1000 }, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error creating player' });
    });
  });

  describe('remove', () => {
    it('should remove a player', () => {
      jest.spyOn(service, 'remove').mockImplementation((id, callback) => callback(null));

      controller.remove('1', mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should return 500 on error', () => {
      jest.spyOn(service, 'remove').mockImplementation((id, callback) => callback(new Error('Error removing player')));

      controller.remove('1', mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error removing player' });
    });
  });
});
