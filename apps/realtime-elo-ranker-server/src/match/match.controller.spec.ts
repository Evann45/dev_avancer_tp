import { Test, TestingModule } from '@nestjs/testing';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { Response } from 'express';

describe('MatchController', () => {
  let controller: MatchController;
  let service: MatchService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [MatchController],
      providers: [
        {
          provide: MatchService,
          useValue: {
            createMatch: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get<MatchController>(MatchController);
    service = moduleRef.get<MatchService>(MatchService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all matches', async () => {
      const mockResponse = [{ id: 1, winner: 'player1', loser: 'player2', draw: false }];
      jest.spyOn(service, 'findAll').mockResolvedValue(mockResponse);

      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
      await controller.findAll(res);

      expect(service.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  });

  describe('findOne', () => {
    it('should return a match by ID', async () => {
      const mockMatch = { id: 1, winner: 'player1', loser: 'player2', draw: false };
      jest.spyOn(service, 'findOne').mockImplementation((id, callback) => callback(null, mockMatch));

      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
      controller.findOne(1, res);

      expect(service.findOne).toHaveBeenCalledWith(1, expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockMatch);
    });

    it('should return 404 if match not found', async () => {
      jest.spyOn(service, 'findOne').mockImplementation((id, callback) => callback(null, null));

      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
      controller.findOne(1, res);

      expect(service.findOne).toHaveBeenCalledWith(1, expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Match with id 1 not found' });
    });
  });

  describe('createMatch', () => {
    it('should create a new match', async () => {
      const matchDto: CreateMatchDto = { winner: 'player1', loser: 'player2', draw: false };
      const mockMatch = { id: 1, ...matchDto };

      jest.spyOn(service, 'createMatch').mockImplementation((dto, callback) => callback(null, mockMatch));

      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
      await controller.createMatch(matchDto, res);

      expect(service.createMatch).toHaveBeenCalledWith(matchDto, expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockMatch);
    });

    it('should return 500 if an error occurs', async () => {
      const matchDto: CreateMatchDto = { winner: 'player1', loser: 'player2', draw: false };
      const error = new Error('Something went wrong');

      jest.spyOn(service, 'createMatch').mockImplementation((dto, callback) => callback(error, null));

      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
      await controller.createMatch(matchDto, res);

      expect(service.createMatch).toHaveBeenCalledWith(matchDto, expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error while creating match', error: error.message });
    });
  });
});
