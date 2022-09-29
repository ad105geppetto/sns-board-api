import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BoardHashTags } from './models/board_hashTags.model';
import { HashTags } from './models/hashTag.model';
import { Boards } from './models/boards.model';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class BoardsService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(BoardHashTags) private boardHashTagModel: typeof BoardHashTags,
    @InjectModel(HashTags) private hashTagsModel: typeof HashTags,
    @InjectModel(Boards) private boardModel: typeof Boards,
  ) { }

  async create(boardsInfo) {
    return await this.sequelize.transaction(async (transaction) => {
      const transactionHost = { transaction: transaction };
      const board = await this.boardModel.create(boardsInfo, transactionHost);
      const hashTags = await Promise.all(boardsInfo.hashTags.map(async (hashTag) => {
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

      hashTags.map(async (hashTag) => {
        return await this.boardHashTagModel.create({ board_id: board.id, hashTag_id: hashTag.id }, transactionHost);
      })

      return { board: board, hashTags: hashTags }
    })
  }
}