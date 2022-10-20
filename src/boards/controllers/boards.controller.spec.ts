import { Test, TestingModule } from "@nestjs/testing";
import { BoardsController } from "./boards.controller";
import { BoardsService } from "../services/boards.service";
import { BadRequestException } from "@nestjs/common";

let boardsController: BoardsController;
let boardId;
let boardInfo;
let queryInfo;
let authorization;
const mockBoardService = {
  create: jest.fn(),
  getAll: jest.fn(),
  getOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  restore: jest.fn(),
  convertLikeByUser: jest.fn(),
};

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [BoardsController],
    providers: [BoardsService],
  })
    .overrideProvider(BoardsService)
    .useValue(mockBoardService)
    .compile();

  boardsController = module.get<BoardsController>(BoardsController);
});

describe("BoardsController", () => {
  it("게시글 컨트롤러 확인합니다", async () => {
    expect(boardsController).toBeDefined();
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
      expect(typeof boardsController.create).toBe("function");
    });
    it("게시글 생성 서비스의 함수(create)를 호출할 수 있습니다", async () => {
      await boardsController.create(boardInfo, authorization);
      expect(mockBoardService.create).toBeCalledWith(boardInfo, authorization);
    });
    it("게시글을 생성할 수 있습니다", async () => {
      const newBoardInfo = {
        id: 1,
        ...boardInfo,
        user_id: 1,
        updatedAt: "2022-02-22",
        createdAt: "2022-02-22",
      };
      mockBoardService.create.mockReturnValue(newBoardInfo);
      expect(
        await boardsController.create(boardInfo, authorization),
      ).toStrictEqual(newBoardInfo);
    });
    it("로그인을 하지 않았다면, 에러를 반환합니다", async () => {
      authorization = "";

      try {
        await boardsController.create(boardInfo, authorization);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
    it("해쉬태그에 #이 없다면, 에러를 반환합니다", async () => {
      const newBoardInfo = { ...boardInfo, hashTags: ["해쉬태그"] };
      try {
        mockBoardService.create.mockReturnValue(newBoardInfo);
        await boardsController.create(newBoardInfo, authorization);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe("GET 게시글 목록 조회", () => {
    beforeEach(() => {
      queryInfo = {
        search: "게시글 제목",
        sortBy: "created",
        orderBy: "desc",
        filter: "#해쉬태그",
        page: 1,
        limit: 10,
      };
      boardInfo = {
        id: 1,
        title: "게시글 제목",
        views_count: 0,
        likes_count: 0,
        hashTags: ["#해쉬태그"],
        updatedAt: "2022-02-22",
        createdAt: "2022-02-22",
      };
    });

    it("게시글 조회 함수(getAll) 확인합니다", async () => {
      expect(typeof boardsController.getAll).toBe("function");
    });
    it("게시글 목록 조회 서비스의 함수(getAll)를 호출할 수 있습니다", async () => {
      await boardsController.getAll(queryInfo);
      expect(mockBoardService.getAll).toBeCalledWith(queryInfo);
    });
    it("게시글 목록 조회할 수 있습니다", async () => {
      mockBoardService.getAll.mockReturnValue([boardInfo]);
      expect(await boardsController.getAll(queryInfo)).toStrictEqual([
        boardInfo,
      ]);
    });
  });

  describe("GET 게시글 조회", () => {
    beforeEach(() => {
      boardId = 1;
      boardInfo = {
        id: 1,
        title: "게시글 제목",
        content: "게시글 내용",
        views_count: 0,
        likes_count: 1,
        hashTags: ["#해쉬태그"],
        updatedAt: "2022-02-22",
        createdAt: "2022-02-22",
      };
    });

    it("게시글 함수(getOne) 확인합니다", async () => {
      expect(typeof boardsController.getOne).toBe("function");
    });
    it("게시글 조회 서비스의 함수(getOne)를 호출할 수 있습니다", async () => {
      await boardsController.getOne(boardId);
      expect(mockBoardService.getOne).toBeCalledWith(boardId);
    });
    it("게시글 조회할 수 있습니다", async () => {
      mockBoardService.getOne.mockReturnValue(boardInfo);
      expect(await boardsController.getOne(boardId)).toStrictEqual(boardInfo);
    });
  });

  describe("PATCH 게시글 수정", () => {
    beforeEach(() => {
      boardId = 1;
      authorization = "authorization";
      boardInfo = {
        title: "수정된 게시글 제목",
        content: "게시글 내용",
        hashTags: ["#해쉬태그"],
      };
    });

    it("게시글 수정 함수(update) 확인합니다", async () => {
      expect(typeof boardsController.update).toBe("function");
    });
    it("게시글 수정 서비스의 함수(update)를 호출할 수 있습니다", async () => {
      await boardsController.update(boardId, boardInfo, authorization);
      expect(mockBoardService.update).toBeCalledWith(
        boardId,
        boardInfo,
        authorization,
      );
    });
    it("게시글 수정할 수 있습니다", async () => {
      mockBoardService.update.mockReturnValue(boardInfo);
      expect(
        await boardsController.update(boardId, boardInfo, authorization),
      ).toStrictEqual(boardInfo);
    });
    it("로그인을 하지 않았다면, 에러를 반환합니다", async () => {
      authorization = "";

      try {
        await boardsController.update(boardId, boardInfo, authorization);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe("DELETE 게시글 삭제", () => {
    beforeEach(() => {
      boardId = 1;
      authorization = "authorization";
    });

    it("게시글 삭제 함수(delete) 확인합니다", async () => {
      expect(typeof boardsController.delete).toBe("function");
    });
    it("게시글 삭제 서비스의 함수(delete)를 호출할 수 있습니다", async () => {
      await boardsController.delete(boardId, authorization);
      expect(mockBoardService.delete).toBeCalledWith(boardId, authorization);
    });
    it("게시글 삭제할 수 있습니다", async () => {
      mockBoardService.delete.mockReturnValue({ id: boardId });
      expect(
        await boardsController.delete(boardId, authorization),
      ).toStrictEqual({
        id: boardId,
      });
    });
    it("로그인을 하지 않았다면, 에러를 반환합니다", async () => {
      authorization = "";

      try {
        await boardsController.delete(boardId, authorization);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe("PATCH 게시글 복구", () => {
    beforeEach(() => {
      boardId = 1;
      authorization = "authorization";
    });

    it("게시글 복구 함수(restore) 확인합니다", async () => {
      expect(typeof boardsController.restore).toBe("function");
    });
    it("게시글 복구 서비스의 함수(restore)를 호출할 수 있습니다", async () => {
      await boardsController.restore(boardId, authorization);
      expect(mockBoardService.restore).toBeCalledWith(boardId, authorization);
    });
    it("게시글 복구할 수 있습니다", async () => {
      const restoredBoard = {
        id: 1,
        title: "수정된 게시글 제목",
        content: "게시글 내용",
        views_count: 0,
        likes_count: 1,
        hashTags: ["#해쉬태그"],
        updatedAt: "2022-02-22",
        createdAt: "2022-02-22",
      };
      mockBoardService.restore.mockReturnValue(restoredBoard);
      expect(
        await boardsController.restore(boardId, authorization),
      ).toStrictEqual(restoredBoard);
    });
    it("로그인을 하지 않았다면, 에러를 반환합니다", async () => {
      authorization = "";

      try {
        await boardsController.restore(boardId, authorization);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe("POST 게시글의 좋아요 기능", () => {
    beforeEach(() => {
      boardId = 1;
      authorization = "authorization";
    });

    it("게시글 좋아요 기능 함수(convertLikeByUser) 확인합니다", async () => {
      expect(typeof boardsController.convertLikeByUser).toBe("function");
    });
    it("게시글 좋아요 기능 서비스의 함수(convertLikeByUser)를 호출할 수 있습니다", async () => {
      await boardsController.convertLikeByUser(boardId, authorization);
      expect(mockBoardService.convertLikeByUser).toBeCalledWith(
        boardId,
        authorization,
      );
    });
    it("게시글 좋아요를 추가할 수 있습니다", async () => {
      mockBoardService.convertLikeByUser.mockReturnValue({
        message: "success",
      });
      expect(
        await boardsController.convertLikeByUser(boardId, authorization),
      ).toStrictEqual({ message: "success" });
    });
    it("게시글 좋아요를 취소할 수 있습니다", async () => {
      mockBoardService.convertLikeByUser.mockReturnValue({ message: "cancel" });
      expect(
        await boardsController.convertLikeByUser(boardId, authorization),
      ).toStrictEqual({ message: "cancel" });
    });
    it("로그인을 하지 않았다면, 에러를 반환합니다", async () => {
      authorization = "";

      try {
        await boardsController.convertLikeByUser(boardId, authorization);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });
});
