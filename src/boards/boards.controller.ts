import { Controller, Post, Body } from '@nestjs/common';
import { BoardsService } from './boards.service';

@Controller('boards')
export class BoardsController {
  constructor(private readonly BoardsService: BoardsService) { }

  @Post()
  async create(@Body() boardInfo) {
    const data = await this.BoardsService.create(boardInfo)
    return data
  }
}
