import { Test } from '@nestjs/testing';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { PlayerService } from '../player/player.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { Player } from '../player/entities/player.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

describe('MatchController', () => {
  let controller: MatchController;
  let service: MatchService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [MatchController],
    })
      .useMocker((token) => {
        if (token === MatchService) {
          return { createMatch: jest.fn(), findAll: jest.fn() };
        }
        if (token === PlayerService) {
          return { findOne: jest.fn(), updateRank: jest.fn() };
        }
        if (token === getRepositoryToken(Match)) {
          return { save: jest.fn() };
        }
        if (token === getRepositoryToken(Player)) {
          return { findOne: jest.fn() };
        }
        if (token === EventEmitter2) {
          return { emit: jest.fn() };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    controller = moduleRef.get(MatchController);
    service = moduleRef.get(MatchService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createMatch', () => {
    it('should create a match', async () => {
      const matchDto = { winner: '1', loser: '2', draw: false };
      const result = { id: '1', ...matchDto };

      jest.spyOn(service, 'createMatch').mockResolvedValue(result as any);

      expect(await controller.createMatch(matchDto)).toEqual(result);
      expect(service.createMatch).toHaveBeenCalledWith(matchDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of matches', async () => {
      const result = [{ id: '1', winner: '1', loser: '2', draw: false }];
      jest.spyOn(service, 'findAll').mockResolvedValue(result as any);

      expect(await controller.findAll()).toBe(result);
    });
  });
});