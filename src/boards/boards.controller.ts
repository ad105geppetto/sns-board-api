import { Controller, Post, Body, Param, Headers, BadRequestException, Patch, Delete, Get, Query } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardInfoDTO } from './dto/boardInfo.dto';
import { QueryInfoDTO } from './dto/queryInfo.dto';
import { UpdateBoardInfoDTO } from './dto/updateBoardInfo.dto';

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


  @Patch(":boardId/restoration")
  async restore(@Param("boardId") boardId: number, @Headers("Authorization") Authorization: string) {
    try {
      if (!Authorization) {
        throw new BadRequestException("로그인해주세요.")
      }

      const data = await this.BoardsService.restore(boardId, Authorization)

      return data
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  @Patch(":boardId")
  async update(
    @Param("boardId") boardId: number,
    @Body() boardInfo: UpdateBoardInfoDTO,
    @Headers("Authorization") Authorization: string
  ) {
    try {
      if (!Authorization) {
        throw new BadRequestException("로그인해주세요.")
      }

      const data = await this.BoardsService.update(boardId, boardInfo, Authorization)

      return data
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  @Delete(":boardId")
  async delete(@Param("boardId") boardId: number, @Headers("Authorization") Authorization: string) {
    try {
      if (!Authorization) {
        throw new BadRequestException("로그인해주세요.")
      }

      const data = await this.BoardsService.delete(boardId, Authorization)

      return data
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  @Get()
  async getAll(@Query() queryInfo: QueryInfoDTO) {
    try {
      const data = await this.BoardsService.getAll(queryInfo)

      return data
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}

