import { Controller, Post, Body, Headers, BadRequestException } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardInfoDTO } from './dto/boardInfo.dto';

@Controller('boards')
export class BoardsController {
  constructor(
    private readonly BoardsService: BoardsService,
  ) { }

  @Post()
  async create(@Body() boardInfo: BoardInfoDTO, @Headers("Authorization") Authorization: string) {
    try {
      if (!Authorization) {
        throw new BadRequestException("로그인해주세요.")
      }

      boardInfo.hashTags.forEach((hashTag) => {
        if (hashTag.indexOf("#") !== 0) {
          throw new BadRequestException("각각의 hashTag에 #이 포함되어야 합니다.")
        }
      })

      const data = await this.BoardsService.create(boardInfo, Authorization)

      return data
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
