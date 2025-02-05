import { Controller, Get, Post, Body, Param, Delete, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { PlayerService } from './player.service';
import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player-dto';

@Controller('api')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get("ranking")
  findAll(): Promise<Player[]> {
    return this.playerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Res() res: Response): void {
    this.playerService.findOne(id, (err, player) => {
      if (err) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: err.message });
      }
      res.status(HttpStatus.OK).json(player);
    });
  }

  @Post('player')
  create(@Body() createPlayerDto: CreatePlayerDto, @Res() res: Response): void {
    this.playerService.create(createPlayerDto, (err, player) => {
      if (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
      }
      res.status(HttpStatus.CREATED).json(player);
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Res() res: Response): void {
    this.playerService.remove(id, err => {
      if (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
      }
      res.status(HttpStatus.NO_CONTENT).send();
    });
  }
}