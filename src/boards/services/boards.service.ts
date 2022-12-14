import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { BoardHashTags } from "../entities/board_hashTags.entity";
import { HashTags } from "../entities/hashTag.entity";
import { Boards } from "../entities/boards.entity";
import { Sequelize } from "sequelize-typescript";
import { BoardInfoDTO } from "../dto/boardInfo.dto";
import { JwtService } from "@nestjs/jwt";
import { UpdateBoardInfoDTO } from "../dto/updateBoardInfo.dto";
import { Op } from "sequelize";
import { QueryInfoDTO } from "../dto/queryInfo.dto";
import { Users } from "../../users/entities/users.entity";
import { Likes } from "../entities/likes.entity";

@Injectable()
export class BoardsService {
  constructor(
    private sequelize: Sequelize,
    private jwtService: JwtService,
    @InjectModel(BoardHashTags) private boardHashTagModel: typeof BoardHashTags,
    @InjectModel(HashTags) private hashTagsModel: typeof HashTags,
    @InjectModel(Boards) private boardModel: typeof Boards,
    @InjectModel(Likes) private likeModel: typeof Likes,
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
      throw new BadRequestException("?????? ?????? ???????????? ????????????.");
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
              exclude: ["id", "createdAt", "updatedAt", "deletedAt"],
            },
          },
        );

        return hashTag.name;
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

    if (!board) {
      throw new NotFoundException();
    }

    if (tokenInfo.id !== board.user_id) {
      throw new BadRequestException("?????? ?????? ???????????? ????????????.");
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

    if (!board) {
      throw new NotFoundException();
    }

    if (tokenInfo.id !== board.user_id) {
      throw new BadRequestException("?????? ?????? ???????????? ????????????.");
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
    const { search, sortBy, orderBy, filter, page, limit } = queryInfo;

    if (!search && !sortBy && !filter) {
      const boards = await this.boardModel.findAll({
        attributes: {
          exclude: ["user_id", "content", "deletedAt"],
        },
        include: [
          {
            model: Users,
            as: "users",
            attributes: ["email"],
          },
          {
            model: HashTags,
            attributes: ["name"],
            through: {
              attributes: [],
            },
          },
        ],
        offset: page ? (page - 1) * limit : 0,
        limit: limit ? limit : 10,
      });

      const result = Promise.all(
        boards.map(async (board) => {
          const data = board.get({ plain: true });
          const author = data.users.email;

          delete data.users;

          const newHashTags = data.hashTags.map((result) => result.name);

          return {
            ...data,
            author: author,
            hashTags: newHashTags,
          };
        }),
      );

      return result;
    }
    if (search && !sortBy && !filter) {
      const boards = await this.boardModel.findAll({
        where: {
          [Op.or]: [
            {
              title: { [Op.like]: "%" + search + "%" },
            },
          ],
        },
        attributes: {
          exclude: ["user_id", "content", "deletedAt"],
        },
        include: [
          {
            model: Users,
            as: "users",
            attributes: ["email"],
          },
          {
            model: HashTags,
            attributes: ["name"],
            through: {
              attributes: [],
            },
          },
        ],
        offset: page ? (page - 1) * limit : 0,
        limit: limit ? limit : 10,
      });

      const result = Promise.all(
        boards.map(async (board) => {
          const data = board.get({ plain: true });
          const author = data.users.email;

          delete data.users;

          const newHashTags = data.hashTags.map((result) => result.name);

          return {
            ...data,
            author: author,
            hashTags: newHashTags,
          };
        }),
      );

      return result;
    }
    if (!search && sortBy && !filter) {
      const boards = await this.boardModel.findAll({
        attributes: {
          exclude: ["user_id", "content", "deletedAt"],
        },
        include: [
          {
            model: Users,
            as: "users",
            attributes: ["email"],
          },
          {
            model: HashTags,
            attributes: ["name"],
            through: {
              attributes: [],
            },
          },
        ],
        order: [[sortBy ? sortBy : "ceatedAt", orderBy ? orderBy : "asc"]],
        offset: page ? (page - 1) * limit : 0,
        limit: limit ? limit : 10,
      });

      const result = Promise.all(
        boards.map(async (board) => {
          const data = board.get({ plain: true });
          const author = data.users.email;

          delete data.users;

          const newHashTags = data.hashTags.map((result) => result.name);

          return {
            ...data,
            author: author,
            hashTags: newHashTags,
          };
        }),
      );

      return result;
    }
    if (!search && !sortBy && filter) {
      const boards = await this.boardModel.findAll({
        attributes: {
          exclude: ["user_id", "content", "deletedAt"],
        },
        include: [
          {
            model: Users,
            as: "users",
            attributes: ["email"],
          },
          {
            model: HashTags,
            attributes: ["name"],
            through: {
              attributes: [],
            },
          },
        ],
        offset: page ? (page - 1) * limit : 0,
        limit: limit ? limit : 10,
      });

      const filteredBoards = boards.filter((board) => {
        const data = board.get({ plain: true });
        const result = data.hashTags.filter(
          (hashTag) => hashTag.name === `#${filter}`,
        );

        if (result[0]) {
          return true;
        } else {
          return false;
        }
      });

      const newBoards = Promise.all(
        filteredBoards.map(async (board) => {
          const data = board.get({ plain: true });
          const newBoard = { ...data };
          const author = data.users.email;
          delete newBoard.users;
          const newHashTags = board.hashTags.map((result) => result.name);
          return {
            ...newBoard,
            author: author,
            hashTags: newHashTags,
          };
        }),
      );

      return newBoards;
    }
    if (search && sortBy && !filter) {
      const boards = await this.boardModel.findAll({
        where: {
          [Op.or]: [
            {
              title: { [Op.like]: "%" + search + "%" },
            },
          ],
        },
        attributes: {
          exclude: ["user_id", "content", "deletedAt"],
        },
        include: [
          {
            model: Users,
            as: "users",
            attributes: ["email"],
          },
          {
            model: HashTags,
            attributes: ["name"],
            through: {
              attributes: [],
            },
          },
        ],
        order: [[sortBy ? sortBy : "ceatedAt", orderBy ? orderBy : "asc"]],
        offset: page ? (page - 1) * limit : 0,
        limit: limit ? limit : 10,
      });

      const result = Promise.all(
        boards.map(async (board) => {
          const data = board.get({ plain: true });
          const author = data.users.email;

          delete data.users;

          const newHashTags = data.hashTags.map((result) => result.name);

          return {
            ...data,
            author: author,
            hashTags: newHashTags,
          };
        }),
      );

      return result;
    }
    if (!search && sortBy && filter) {
      const boards = await this.boardModel.findAll({
        attributes: {
          exclude: ["user_id", "content", "deletedAt"],
        },
        order: [[sortBy ? sortBy : "ceatedAt", orderBy ? orderBy : "asc"]],
        include: [
          {
            model: Users,
            as: "users",
            attributes: ["email"],
          },
          {
            model: HashTags,
            attributes: ["name"],
            through: {
              attributes: [],
            },
          },
        ],
        offset: page ? (page - 1) * limit : 0,
        limit: limit ? limit : 10,
      });

      const filteredBoards = boards.filter((board) => {
        const data = board.get({ plain: true });
        const result = data.hashTags.filter(
          (hashTag) => hashTag.name === `#${filter}`,
        );

        if (result[0]) {
          return true;
        } else {
          return false;
        }
      });

      const newBoards = Promise.all(
        filteredBoards.map(async (board) => {
          const data = board.get({ plain: true });
          const newBoard = { ...data };
          const author = data.users.email;
          delete newBoard.users;
          const newHashTags = board.hashTags.map((result) => result.name);
          return {
            ...newBoard,
            author: author,
            hashTags: newHashTags,
          };
        }),
      );

      return newBoards;
    }
    if (search && !sortBy && filter) {
      const boards = await this.boardModel.findAll({
        where: {
          [Op.or]: [
            {
              title: { [Op.like]: "%" + search + "%" },
            },
          ],
        },
        attributes: {
          exclude: ["user_id", "content", "deletedAt"],
        },
        include: [
          {
            model: Users,
            as: "users",
            attributes: ["email"],
          },
          {
            model: HashTags,
            attributes: ["name"],
            through: {
              attributes: [],
            },
          },
        ],
        offset: page ? (page - 1) * limit : 0,
        limit: limit ? limit : 10,
      });

      const filteredBoards = boards.filter((board) => {
        const data = board.get({ plain: true });
        const result = data.hashTags.filter(
          (hashTag) => hashTag.name === `#${filter}`,
        );

        if (result[0]) {
          return true;
        } else {
          return false;
        }
      });

      const newBoards = Promise.all(
        filteredBoards.map(async (board) => {
          const data = board.get({ plain: true });
          const newBoard = { ...data };
          const author = data.users.email;
          delete newBoard.users;
          const newHashTags = board.hashTags.map((result) => result.name);
          return {
            ...newBoard,
            author: author,
            hashTags: newHashTags,
          };
        }),
      );

      return newBoards;
    }

    const boards = await this.boardModel.findAll({
      where: {
        [Op.or]: [
          {
            title: { [Op.like]: "%" + search + "%" },
          },
        ],
      },
      attributes: {
        exclude: ["user_id", "content", "deletedAt"],
      },
      order: [[sortBy ? sortBy : "ceatedAt", orderBy ? orderBy : "asc"]],
      include: [
        {
          model: Users,
          as: "users",
          attributes: ["email"],
        },
        {
          model: HashTags,
          attributes: ["name"],
          through: {
            attributes: [],
          },
        },
      ],
      offset: page ? (page - 1) * limit : 0,
      limit: limit ? limit : 10,
    });

    const filteredBoards = boards.filter((board) => {
      const data = board.get({ plain: true });
      const result = data.hashTags.filter(
        (hashTag) => hashTag.name === `#${filter}`,
      );
      if (result[0]) {
        return true;
      } else {
        return false;
      }
    });

    const newBoards = Promise.all(
      filteredBoards.map(async (board) => {
        const data = board.get({ plain: true });
        const newBoard = { ...data };
        const author = data.users.email;
        delete newBoard.users;
        const newHashTags = board.hashTags.map((result) => result.name);
        return {
          ...newBoard,
          author: author,
          hashTags: newHashTags,
        };
      }),
    );

    return newBoards;
  }

  async getOne(boardId: number) {
    const board = await this.boardModel.findByPk(boardId);

    if (!board) {
      throw new NotFoundException();
    }

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

  async convertLikeByUser(boardId: number, Authorization: string) {
    const tokenInfo = this.jwtService.verify(Authorization);
    const userId = tokenInfo.id;

    return await this.sequelize.transaction(async (transaction) => {
      const transactionHost = { transaction: transaction };
      const result = await this.likeModel.findOne({
        where: { user_id: userId, board_id: boardId },
        ...transactionHost,
      });

      if (result) {
        await this.likeModel.destroy({
          where: {
            user_id: userId,
            board_id: boardId,
          },
          ...transactionHost,
        });
      } else {
        await this.likeModel.create(
          {
            user_id: userId,
            board_id: boardId,
          },
          transactionHost,
        );
      }

      const likeCount = await this.likeModel.count({
        where: { board_id: boardId },
        ...transactionHost,
      });

      await this.boardModel.update(
        {
          likes_count: likeCount,
        },
        {
          where: {
            id: boardId,
          },
          ...transactionHost,
        },
      );

      return { message: result ? "cancel" : "success" };
    });
  }
}
