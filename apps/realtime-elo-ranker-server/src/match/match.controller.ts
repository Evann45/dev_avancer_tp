import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { Response } from 'express';

@Controller('api/match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get()
  findAll(@Res() res: Response): void {
    this.matchService.findAll().then(matches => {
      res.status(200).json(matches);
    }).catch(err => {
      res.status(500).json({ message: err.message });
    });
  }

  @Get(':id')
  findOne(@Param('id') id: number, @Res() res: Response): void {
    this.matchService.findOne(+id, (err, match) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (!match) {
        return res.status(404).json({ message: `Match with id ${id} not found` });
      }
      res.status(200).json(match);
    });
  }

  @Post()
  createMatch(@Body() createMatchDto: CreateMatchDto, @Res() res: Response): void {
    this.matchService.createMatch(createMatchDto, (err, newMatch) => {
      if (err) {
        console.error('Error while creating match', err);
        return res.status(500).json({ message: 'Error while creating match', error: err.message });
      }
      res.status(201).json(newMatch);
    });
  }
}