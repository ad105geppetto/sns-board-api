import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardInfoDTO } from './dto/boardInfo.dto';

@Controller('boards')
export class BoardsController {
  constructor(private readonly BoardsService: BoardsService) { }

  @Post()
  async create(@Body() boardInfo: BoardInfoDTO) {
    const data = await this.BoardsService.create(boardInfo)

    return data
  }
}
