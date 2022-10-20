import { Test, TestingModule } from "@nestjs/testing";
import { BoardsService } from "./boards.service";
import { Likes } from "../entities/likes.entity";
import { Boards } from "../entities/boards.entity";
import { HashTags } from "../entities/hashTag.entity";
import { BoardHashTags } from "../entities/board_hashTags.entity";
import { getModelToken } from "@nestjs/sequelize";
import { JwtService } from "@nestjs/jwt";
import { Sequelize } from "sequelize-typescript";

let boardsService: BoardsService;
let boardInfo;
let queryInfo;
let boardId;
let authorization;

const mockBoardModel = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  restore: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
};

const mockHashTagModel = {
  findOrCreate: jest.fn(),
  findByPk: jest.fn(),
};

const mockBoardHashTagModel = {
  create: jest.fn(),
  findAll: jest.fn(),
  restore: jest.fn(),
  destroy: jest.fn(),
};

const mockLikeModel = {
  findOne: jest.fn(),
  create: jest.fn(),
  destroy: jest.fn(),
  count: jest.fn(),
};

const mockJwtService = {
  verify: jest.fn(),
};

const mockSequelize = {
  transaction: jest.fn(),
};

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      BoardsService,
      {
        provide: Sequelize,
        useValue: mockSequelize,
      },
      {
        provide: JwtService,
        useValue: mockJwtService,
      },
      {
        provide: getModelToken(BoardHashTags),
        useValue: mockBoardHashTagModel,
      },
      {
        provide: getModelToken(HashTags),
        useValue: mockHashTagModel,
      },
      {
        provide: getModelToken(Boards),
        useValue: mockBoardModel,
      },
      {
        provide: getModelToken(Likes),
        useValue: mockLikeModel,
      },
    ],
  }).compile();

  boardsService = module.get<BoardsService>(BoardsService);
});

describe("LoginService", () => {
  it("로그인 서비스 확인합니다", async () => {
    expect(boardsService).toBeDefined();
  });

  describe("POST 게시글 생성", () => {
    beforeEach(() => {
      boardInfo = {
        title: "게시글 제목",
        content: "게시글 내용",
        hashTags: ["#해쉬태그"],
      };
      authorization = "authorization";
    });
    it("게시글 생성 함수(create) 확인합니다", async () => {
      expect(typeof boardsService.create).toBe("function");
    });
    it("모델(Boards, HashTags, BoardHashTags)의 함수들을 호출할 수 있습니다", async () => {
      mockJwtService.verify.mockImplementationOnce(() => {
        return { id: 1 };
      });
      mockSequelize.transaction.mockImplementationOnce((cb) => cb());
      boardInfo.get = jest.fn().mockReturnValue(boardInfo);
      mockBoardModel.create.mockResolvedValue(boardInfo);
      mockHashTagModel.findOrCreate.mockImplementationOnce(() => {
        return [{ id: 1, name: "#해쉬태그" }];
      });
      await boardsService.create(boardInfo, authorization);
      expect(mockBoardModel.create).toBeCalled();
      expect(mockHashTagModel.findOrCreate).toBeCalled();
      expect(mockBoardHashTagModel.create).toBeCalled();
    });
    it("게시글을 생성할 수 있습니다", async () => {
      mockJwtService.verify.mockImplementationOnce(() => {
        return { id: 1 };
      });
      mockSequelize.transaction.mockImplementationOnce((cb) => cb());
      boardInfo.get = jest.fn().mockReturnValue(boardInfo);
      mockBoardModel.create.mockResolvedValue(boardInfo);
      mockHashTagModel.findOrCreate.mockImplementationOnce(() => {
        return [{ id: 1, name: "#해쉬태그" }];
      });
      expect(await boardsService.create(boardInfo, authorization)).toEqual({
        ...boardInfo,
      });
    });
  });

  describe("GET 게시글 목록 조회", () => {
    beforeEach(() => {
      queryInfo = {
        search: "게시글 제목",
        sortBy: "createdAt",
        orderBy: "desc",
        filter: "#해쉬태그",
        page: 1,
        limit: 10,
      };
      boardInfo = {
        title: "게시글 제목",
        content: "게시글 내용",
        hashTags: ["#해쉬태그"],
      };
    });
    it("게시글 목록 조회 함수(getAll) 확인합니다", async () => {
      expect(typeof boardsService.getAll).toBe("function");
    });
    it("모델의 함수들을 호출할 수 있습니다", async () => {
      queryInfo = "";
      const data = {
        title: "게시글 제목",
        content: "게시글 내용",
        users: { email: "email" },
        hashTags: [{ id: 1, name: "#해쉬태그" }],
      };
      const boards = [boardInfo];
      boardInfo.get = jest.fn().mockReturnValue(data);
      mockBoardModel.findAll.mockResolvedValue(boards);
      await boardsService.getAll(queryInfo);
      expect(mockBoardModel.findAll).toBeCalled();
    });
    it("게시글 목록 조회할 수 있습니다", async () => {
      queryInfo = "";
      const data = {
        title: "게시글 제목",
        content: "게시글 내용",
        users: { email: "email" },
        hashTags: [{ id: 1, name: "#해쉬태그" }],
      };
      const newData = [
        {
          author: "email",
          content: "게시글 내용",
          hashTags: ["#해쉬태그"],
          title: "게시글 제목",
        },
      ];
      const boards = [boardInfo];
      boardInfo.get = jest.fn().mockReturnValue(data);
      mockBoardModel.findAll.mockResolvedValue(boards);
      expect(await boardsService.getAll(queryInfo)).toEqual(newData);
    });
  });

  describe("GET 게시글 조회", () => {
    beforeEach(() => {
      boardId = 1;
    });
    it("게시글 조회 함수(getOne) 확인합니다", async () => {
      expect(typeof boardsService.getOne).toBe("function");
    });
    it("모델의 함수를 호출할 수 있습니다", async () => {
      const board = {
        author: "email",
        content: "게시글 내용",
        hashTags: ["#해쉬태그"],
        title: "게시글 제목",
        views_count: 0,
      };
      mockBoardModel.findByPk.mockResolvedValue(board);
      await boardsService.getOne(boardId);
      expect(mockBoardModel.findByPk).toBeCalled();
    });
    it("게시글 조회할 수 있습니다", async () => {
      const board = {
        author: "email",
        content: "게시글 내용",
        hashTags: ["#해쉬태그"],
        title: "게시글 제목",
        views_count: 0,
      };
      mockBoardModel.findByPk.mockResolvedValue(board);
      expect(await boardsService.getOne(boardId)).toBe(board);
    });
  });

  describe("PATCH 게시글 수정", () => {
    beforeEach(() => {
      boardId = 1;
      boardInfo = {
        title: "새로운 게시글 제목",
        content: "새로운 게시글 내용",
      };
      authorization = "Authorization";
    });
    it("게시글 수정 함수(update) 확인합니다", async () => {
      expect(typeof boardsService.update).toBe("function");
    });
    it("모델의 함수를 호출할 수 있습니다", async () => {
      const board = {
        author: "email",
        content: "게시글 내용",
        hashTags: ["#해쉬태그"],
        title: "게시글 제목",
        user_id: 1,
        views_count: 0,
      };
      mockJwtService.verify.mockImplementationOnce(() => {
        return { id: 1 };
      });
      mockBoardModel.findByPk.mockReturnValue(board);
      mockSequelize.transaction.mockImplementationOnce((cb) => cb());
      boardInfo.get = jest.fn().mockReturnValue(boardInfo);
      mockHashTagModel.findOrCreate.mockImplementationOnce(() => {
        return [{ id: 1, name: "#해쉬태그" }];
      });
      mockBoardHashTagModel.findAll.mockImplementationOnce(() => {
        return [{ hashTag_id: 1, name: "#해쉬태그" }];
      });
      mockHashTagModel.findByPk.mockReturnValue({ name: "#해쉬태그" });
      await boardsService.update(boardId, boardInfo, authorization);
      expect(mockBoardModel.findByPk).toBeCalled();
      expect(mockBoardModel.update).toBeCalled();
      expect(mockBoardHashTagModel.findAll).toBeCalled();
      expect(mockHashTagModel.findByPk).toBeCalled();
    });
    it("게시글 수정할 수 있습니다", async () => {
      const board = {
        author: "email",
        content: "게시글 내용",
        hashTags: ["#해쉬태그"],
        title: "게시글 제목",
        user_id: 1,
        views_count: 0,
      };
      mockJwtService.verify.mockImplementationOnce(() => {
        return { id: 1 };
      });
      mockBoardModel.findByPk.mockReturnValue(board);
      mockSequelize.transaction.mockImplementationOnce((cb) => cb());
      boardInfo.get = jest.fn().mockReturnValue(boardInfo);
      mockBoardModel.update.mockResolvedValue(boardInfo);
      mockHashTagModel.findOrCreate.mockImplementationOnce(() => {
        return [{ id: 1, name: "#해쉬태그" }];
      });
      mockBoardHashTagModel.findAll.mockImplementationOnce(() => {
        return [{ hashTag_id: 1, name: "#해쉬태그" }];
      });
      mockHashTagModel.findByPk.mockReturnValue({ name: "#해쉬태그" });
      expect(
        await boardsService.update(boardId, boardInfo, authorization),
      ).toEqual(board);
    });
  });

  describe("DELETE 게시글 삭제", () => {
    beforeEach(() => {
      boardId = 1;
      authorization = "Authorization";
    });
    it("게시글 삭제 함수(delete) 확인합니다", async () => {
      expect(typeof boardsService.delete).toBe("function");
    });
    it("모델의 함수를 호출할 수 있습니다", async () => {
      const board = {
        author: "email",
        content: "게시글 내용",
        hashTags: ["#해쉬태그"],
        title: "게시글 제목",
        user_id: 1,
        views_count: 0,
      };
      mockJwtService.verify.mockImplementationOnce(() => {
        return { id: 1 };
      });
      mockBoardModel.findByPk.mockReturnValue(board);
      mockSequelize.transaction.mockImplementationOnce((cb) => cb());
      await boardsService.delete(boardId, authorization);
      expect(mockBoardModel.findByPk).toBeCalled();
      expect(mockBoardModel.destroy).toBeCalled();
      expect(mockBoardHashTagModel.destroy).toBeCalled();
    });
    it("게시글 삭제할 수 있습니다", async () => {
      const board = {
        author: "email",
        content: "게시글 내용",
        hashTags: ["#해쉬태그"],
        title: "게시글 제목",
        user_id: 1,
        views_count: 0,
      };
      mockJwtService.verify.mockImplementationOnce(() => {
        return { id: 1 };
      });
      mockBoardModel.findByPk.mockReturnValue(board);
      mockSequelize.transaction.mockImplementationOnce((cb) => cb());
      expect(await boardsService.delete(boardId, authorization)).toEqual({
        id: 1,
      });
    });
  });

  describe("PATCH 게시글 복구", () => {
    beforeEach(() => {
      boardId = 1;
      authorization = "Authorization";
    });
    it("게시글 복구 함수(restore) 확인합니다", async () => {
      expect(typeof boardsService.restore).toBe("function");
    });
    it("모델의 함수를 호출할 수 있습니다", async () => {
      const board = {
        author: "email",
        content: "게시글 내용",
        hashTags: ["#해쉬태그"],
        title: "게시글 제목",
        user_id: 1,
        views_count: 0,
      };
      mockJwtService.verify.mockImplementationOnce(() => {
        return { id: 1 };
      });
      mockBoardModel.findByPk.mockReturnValue(board);
      mockSequelize.transaction.mockImplementationOnce((cb) => cb());
      mockBoardHashTagModel.findAll.mockReturnValueOnce([]);
      await boardsService.restore(boardId, authorization);
      expect(mockBoardModel.findByPk).toBeCalled();
      expect(mockBoardHashTagModel.findAll).toBeCalled();
    });
    it("게시글 복구할 수 있습니다", async () => {
      const board = {
        author: "email",
        content: "게시글 내용",
        hashTags: ["#해쉬태그"],
        title: "게시글 제목",
        user_id: 1,
        views_count: 0,
      };
      mockJwtService.verify.mockImplementationOnce(() => {
        return { id: 1 };
      });
      mockBoardModel.findByPk.mockReturnValue(board);
      mockSequelize.transaction.mockImplementationOnce((cb) => cb());
      mockBoardHashTagModel.findAll.mockReturnValueOnce(["#해쉬태그"]);
      mockHashTagModel.findByPk.mockReturnValue({ name: "#해쉬태그" });
      expect(await boardsService.restore(boardId, authorization)).toEqual(
        board,
      );
    });
  });

  describe("POST 좋아요 기능", () => {
    beforeEach(() => {
      boardId = 1;
      authorization = "Authorization";
    });
    it("좋아요 기능 함수(convertLikeByUser)를 확인합니다", async () => {
      expect(typeof boardsService.convertLikeByUser).toBe("function");
    });
    it("모델의 함수를 호출할 수 있습니다", async () => {
      mockJwtService.verify.mockImplementationOnce(() => {
        return { id: 1 };
      });
      mockSequelize.transaction.mockImplementationOnce((cb) => cb());
      mockLikeModel.findOne.mockReturnValueOnce(undefined);
      await boardsService.convertLikeByUser(boardId, authorization);
      expect(mockLikeModel.findOne).toBeCalled();
      expect(mockLikeModel.create).toBeCalled();
      expect(mockLikeModel.count).toBeCalled();
      expect(mockBoardModel.update).toBeCalled();
    });
    it("좋아요를 성공합니다", async () => {
      mockJwtService.verify.mockImplementationOnce(() => {
        return { id: 1 };
      });
      mockSequelize.transaction.mockImplementationOnce((cb) => cb());
      mockLikeModel.findOne.mockReturnValueOnce(undefined);
      mockLikeModel.create.mockReturnValueOnce({ message: "success" });
      expect(
        await boardsService.convertLikeByUser(boardId, authorization),
      ).toEqual({ message: "success" });
    });
    it("좋아요를 취소합니다", async () => {
      mockJwtService.verify.mockImplementationOnce(() => {
        return { id: 1 };
      });
      mockSequelize.transaction.mockImplementationOnce((cb) => cb());
      mockLikeModel.findOne.mockReturnValueOnce({ user_id: 1, board_id: 1 });
      mockLikeModel.destroy.mockReturnValueOnce({ message: "cancel" });
      expect(
        await boardsService.convertLikeByUser(boardId, authorization),
      ).toEqual({ message: "cancel" });
    });
  });
});
