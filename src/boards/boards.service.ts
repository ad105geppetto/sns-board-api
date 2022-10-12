import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { BoardHashTags } from "./models/board_hashTags.model";
import { HashTags } from "./models/hashTag.model";
import { Boards } from "./models/boards.model";
import {
  BeforeFindAfterExpandIncludeAll,
  Sequelize,
} from "sequelize-typescript";
import { BoardInfoDTO } from "./dto/boardInfo.dto";
import { JwtService } from "@nestjs/jwt";
import { UpdateBoardInfoDTO } from "./dto/updateBoardInfo.dto";
import { Op } from "sequelize";
import { QueryInfoDTO } from "./dto/queryInfo.dto";

@Injectable()
export class BoardsService {
  constructor(
    private sequelize: Sequelize,
    private jwtService: JwtService,
    @InjectModel(BoardHashTags) private boardHashTagModel: typeof BoardHashTags,
    @InjectModel(HashTags) private hashTagsModel: typeof HashTags,
    @InjectModel(Boards) private boardModel: typeof Boards,
  ) {}

  async create(boardInfo: BoardInfoDTO, Authorization: string) {
    const tokenInfo = this.jwtService.verify(Authorization);

    return await this.sequelize.transaction(async (transaction) => {
      const transactionHost = { transaction: transaction };
      const { title, content } = boardInfo;
      const board = await this.boardModel
        .create(
          {
            title: title,
            content: content,
            user_id: tokenInfo.id,
          },
          {
            plain: true,
            ...transactionHost,
          },
        )
        .then((resultEntity) => {
          const dataObj = resultEntity.get({ plain: true });
          return dataObj;
        });

      const hashTags = await Promise.all(
        boardInfo.hashTags.map(async (hashTag) => {
          const newHashTag = await this.hashTagsModel.findOrCreate({
            where: { name: hashTag },
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
            raw: true,
            ...transactionHost,
          });
          const id = newHashTag[0].id;
          const name = newHashTag[0].name;

          return { id: id, name: name };
        }),
      );

      await Promise.all(
        hashTags.map(async (hashTag) => {
          await this.boardHashTagModel.create(
            { board_id: board.id, hashTag_id: hashTag.id },
            transactionHost,
          );
        }),
      );

      const newHashTag = hashTags.map((hashTag) => hashTag.name);

      return { ...board, hashTags: newHashTag };
    });
  }

  async restore(boardId: number, Authorization: string) {
    const tokenInfo = this.jwtService.verify(Authorization);
    const board = await this.boardModel.findByPk(boardId, {
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt"],
      },
      raw: true,
      paranoid: false,
    });

    if (tokenInfo.id !== board.user_id) {
      throw new BadRequestException("해당 글의 작성자가 아닙니다.");
    }

    await this.boardModel.restore({ where: { id: boardId } });
    const boardHashTags = await this.boardHashTagModel.findAll({
      where: { board_id: boardId },
      raw: true,
      paranoid: false,
    });

    boardHashTags.forEach(async () => {
      await this.boardHashTagModel.restore({ where: { id: boardId } });
    });
    const storedBoard = await this.boardModel.findByPk(boardId, {
      attributes: {
        exclude: ["user_id", "createdAt", "updatedAt", "deletedAt"],
      },
      raw: true,
    });
    const hashTags = await Promise.all(
      boardHashTags.map(async (boardHashTag) => {
        const hashTag = await this.hashTagsModel.findByPk(
          boardHashTag.hashTag_id,
          {
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
        );

        return hashTag;
      }),
    );
    return { ...storedBoard, hashTags: hashTags };
  }

  async update(
    boardId: number,
    boardInfo: UpdateBoardInfoDTO,
    Authorization: string,
  ) {
    const tokenInfo = this.jwtService.verify(Authorization);
    const board = await this.boardModel.findByPk(boardId, {
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt"],
      },
      raw: true,
    });

    if (tokenInfo.id !== board.user_id) {
      throw new BadRequestException("해당 글의 작성자가 아닙니다.");
    }

    return await this.sequelize.transaction(async (transaction) => {
      const transactionHost = { transaction: transaction };
      const { title, content } = boardInfo;
      await this.boardModel.update(
        {
          title: title,
          content: content,
        },
        {
          where: { id: boardId },
          ...transactionHost,
        },
      );
      const newBoard = await this.boardModel.findByPk(boardId, {
        attributes: {
          exclude: ["user_id", "createdAt", "updatedAt", "deletedAt"],
        },
        raw: true,
        transaction,
      });

      if (!boardInfo.hashTags) {
        const boardHashTags = await this.boardHashTagModel.findAll({
          where: { board_id: boardId },
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
          raw: true,
          ...transactionHost,
        });

        const hashTags = await Promise.all(
          boardHashTags.map(async (boardHashTag) => {
            const data = await this.hashTagsModel.findByPk(
              boardHashTag.hashTag_id,
              {
                attributes: {
                  exclude: ["id", "createdAt", "updatedAt", "deletedAt"],
                },
                raw: true,
                ...transactionHost,
              },
            );
            return data.name;
          }),
        );

        return { ...newBoard, hashTags };
      }

      const hashTags = await Promise.all(
        boardInfo.hashTags.map(async (hashTag) => {
          const newHashTag = await this.hashTagsModel.findOrCreate({
            where: { name: hashTag },
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
            raw: true,
            ...transactionHost,
          });
          const id = newHashTag[0].id;
          const name = newHashTag[0].name;

          return { id: id, name: name };
        }),
      );

      await this.boardHashTagModel.destroy({
        where: { board_id: boardId },
        ...transactionHost,
      });
      await Promise.all(
        hashTags.map(async (hashTag) => {
          await this.boardHashTagModel.create(
            { board_id: boardId, hashTag_id: hashTag.id },
            transactionHost,
          );
        }),
      );

      const newHashTag = hashTags.map((hashTag) => hashTag.name);

      return { ...newBoard, hashTags: newHashTag };
    });
  }

  async delete(boardId: number, Authorization: string) {
    const tokenInfo = this.jwtService.verify(Authorization);
    const board = await this.boardModel.findByPk(boardId, {
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt"],
      },
      raw: true,
    });

    if (tokenInfo.id !== board.user_id) {
      throw new BadRequestException("해당 글의 작성자가 아닙니다.");
    }

    await this.sequelize.transaction(async (transaction) => {
      await this.boardModel.destroy({ where: { id: boardId }, transaction });
      await this.boardHashTagModel.destroy({
        where: { board_id: boardId },
        transaction,
      });
    });

    return { id: boardId };
  }

  async getAll(queryInfo: QueryInfoDTO) {
    const { search, orderBy, filter, page, limit } = queryInfo;

    if (!search && !orderBy && !filter) {
      console.log({ page, limit });
      const aaa = await this.boardModel.findAll({
        offset: page ? (page - 1) * limit : 0,
        limit: limit ? limit : 10,
      });
      return aaa;
    }
    if (search && !orderBy && !filter) {
      return await this.boardModel.findAll({
        where: {
          [Op.or]: [
            {
              title: { [Op.like]: "%" + search + "%" },
            },
          ],
        },
        offset: page ? (page - 1) * limit : 0,
        limit: limit ? limit : 10,
      });
    }
    if (!search && orderBy && !filter) {
      return await this.boardModel.findAll({
        order: [["title", orderBy]],
        offset: page ? (page - 1) * limit : 0,
        limit: limit ? limit : 10,
      });
    }
    if (!search && !orderBy && filter) {
      return await this.boardModel.findAll({
        include: [
          {
            model: this.hashTagsModel,
            where: {
              [Op.or]: [
                {
                  name: { [Op.like]: `#${filter}` },
                },
              ],
            },
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
        ],
        offset: page ? (page - 1) * limit : 0,
        limit: limit ? limit : 10,
      });
    }
    if (search && orderBy && !filter) {
      return await this.boardModel.findAll({
        where: {
          [Op.or]: [
            {
              title: { [Op.like]: "%" + search + "%" },
            },
          ],
        },
        order: [["title", orderBy]],
        offset: page ? (page - 1) * limit : 0,
        limit: limit ? limit : 10,
      });
    }
    if (!search && orderBy && filter) {
      return await this.boardModel.findAll({
        order: [["title", orderBy]],
        include: [
          {
            model: this.hashTagsModel,
            where: {
              [Op.or]: [
                {
                  name: { [Op.like]: `#${filter}` },
                },
              ],
            },
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
        ],
        offset: page ? (page - 1) * limit : 0,
        limit: limit ? limit : 10,
      });
    }
    if (search && !orderBy && filter) {
      return await this.boardModel.findAll({
        where: {
          [Op.or]: [
            {
              title: { [Op.like]: "%" + search + "%" },
            },
          ],
        },
        include: [
          {
            model: this.hashTagsModel,
            where: {
              [Op.or]: [
                {
                  name: { [Op.like]: `#${filter}` },
                },
              ],
            },
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
        ],
        offset: page ? (page - 1) * limit : 0,
        limit: limit ? limit : 10,
      });
    }
    const boards = await this.boardModel.findAll({
      where: {
        [Op.or]: [
          {
            title: { [Op.like]: "%" + search + "%" },
          },
        ],
      },
      order: [["title", orderBy]],
      attributes: {
        exclude: ["user_id", "createdAt", "updatedAt", "deletedAt"],
      },
      include: [
        {
          model: this.hashTagsModel,
          where: {
            [Op.or]: [
              {
                name: { [Op.like]: `#${filter}` },
              },
            ],
          },
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
      offset: page ? (page - 1) * limit : 0,
      limit: limit ? limit : 10,
    });

    return boards;
  }

  async getOne(boardId: number) {
    const board = await this.boardModel.findByPk(boardId);
    await this.boardModel.update(
      { views_count: board.views_count + 1 },
      { where: { id: boardId } },
    );

    const newBoard = await this.boardModel.findByPk(boardId, {
      attributes: {
        exclude: ["user_id", "createdAt", "updatedAt", "deletedAt"],
      },
    });
    return newBoard;
  }
}
