import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardInfoDTO } from './dto/boardInfo.dto';

@Controller('boards')
export class BoardsController {
  constructor(private readonly BoardsService: BoardsService) { }

  @Post()
  async create(@Body() boardInfo: BoardInfoDTO) {
    boardInfo.hashTags.forEach((hashTag) => {
      if (hashTag.indexOf("#") !== 0) {
        throw new BadRequestException("각각의 hashTag에 #이 포함되어야 합니다.")
      }
    })

    const data = await this.BoardsService.create(boardInfo)

    return data
  }
}
