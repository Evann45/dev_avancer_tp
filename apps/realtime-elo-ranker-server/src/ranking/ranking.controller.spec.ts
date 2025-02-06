import { Test, TestingModule } from '@nestjs/testing';
import { RankingController } from './ranking.controller';
import { RankingService } from './ranking.service';
import { PlayerService } from '../player/player.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player } from '../player/entities/player.entity';
import { Repository } from 'typeorm';

describe('RankingController', () => {
  let controller: RankingController;
  let service: RankingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RankingController],
      providers: [
        RankingService,
        PlayerService,
        {
          provide: getRepositoryToken(Player),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<RankingController>(RankingController);
    service = module.get<RankingService>(RankingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

});