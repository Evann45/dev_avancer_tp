import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MatchService } from './match.service';
import { Match } from './entities/match.entity';
import { CreateMatchDto } from './dto/create-match.dto';

@Controller('api/match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get()
  findAll(): Promise<Match[]> {
    return this.matchService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Match | null> {
    return this.matchService.findOne(+id);
  }

  @Post()
  async create(@Body() match: CreateMatchDto): Promise<any> {
    try {
      return await this.matchService.createMatch(match);
    } catch (e) {
      return 'Erreur lors de la création du match : ' + e;
    }
  }
}