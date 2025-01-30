import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { PlayerService } from './player.service';
import { Player } from '../entities/player.entity';
import { CreatePlayerDto } from './dto/create-player-dto';

@Controller('api')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get("ranking")
  findAll(): Promise<Player[]> {
    return this.playerService.findAll();
  }

  @Get()
  findOne(@Param('id') id: string): Promise<Player> {
    return this.playerService.findOne(id);
  }

  @Post('player')
  create(@Body() createPlayerDto: CreatePlayerDto): Promise<Player> {
    return this.playerService.create(createPlayerDto);
  }

  @Delete()
  remove(@Param('id') id: string): Promise<void> {
    return this.playerService.remove(+id);
  }
}