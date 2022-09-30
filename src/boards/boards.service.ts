import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BoardHashTags } from './models/board_hashTags.model';
import { HashTags } from './models/hashTag.model';
import { Boards } from './models/boards.model';
import { Sequelize } from 'sequelize-typescript';
import { BoardInfoDTO } from './dto/boardInfo.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class BoardsService {
  constructor(
    private sequelize: Sequelize,
    private jwtService: JwtService,
    @InjectModel(BoardHashTags) private boardHashTagModel: typeof BoardHashTags,
    @InjectModel(HashTags) private hashTagsModel: typeof HashTags,
    @InjectModel(Boards) private boardModel: typeof Boards,
  ) { }

  async create(boardInfo: BoardInfoDTO, Authorization: string) {
    const tokenInfo = this.jwtService.verify(Authorization)

    return await this.sequelize.transaction(async (transaction) => {
      const transactionHost = { transaction: transaction };
      const board = await this.boardModel.create({ ...boardInfo, user_id: tokenInfo.id }, transactionHost);
      const hashTags = await Promise.all(boardInfo.hashTags.map(async (hashTag) => {
        const newHashTag = await this.hashTagsModel.findOrCreate({
          where: { name: hashTag },
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"]
          },
          raw: true,
          ...transactionHost
        });
        const id = newHashTag[0].id;
        const name = newHashTag[0].name;

        return { id: id, name: name }
      }))

      await Promise.all(hashTags.map(async (hashTag) => {
        await this.boardHashTagModel.create({ board_id: board.id, hashTag_id: hashTag.id }, transactionHost);
      }))

      return { board: board, hashTags: hashTags }
    })
  }
}