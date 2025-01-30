import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player-dto';

describe('PlayerController', () => {
  let controller: PlayerController;
  let service: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [
        {
          provide: PlayerService,
          useValue: {
            create: jest.fn(),
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

  it('should create a player', async () => {
    const createPlayerDto: CreatePlayerDto = { id: 'John Doe', rank: 1000 };
    const result = { id: 'John Doe', rank: 1000 };
    jest.spyOn(service, 'create').mockResolvedValue(result);

    expect(await controller.create(createPlayerDto)).toBe(result);
  });
});