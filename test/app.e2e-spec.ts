import { Test, TestingModule } from "@nestjs/testing";
import { ValidationPipe } from "@nestjs/common";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";

describe("AppController (e2e)", () => {
  let app: INestApplication;
  let accessToken;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();
  });

  describe("📌 유저 테스트", () => {
    describe("POST /signup", () => {
      it("회원가입 요청을 성공하면, 상태코드 201을 반환합니다.", async () => {
        const response = await request(app.getHttpServer())
          .post("/signup")
          .send({
            email: "gildong@naver.com",
          });
        expect(response.statusCode).toBe(201);
        expect(response.body.email).toBe("gildong@naver.com");
      });
      it("회원가입 요청을 실패하면, 상태코드 400을 반환합니다.", async () => {
        const response = await request(app.getHttpServer())
          .post("/signup")
          .send({
            email: "",
          });
        expect(response.statusCode).toBe(400);
      });
    });
    describe("POST /login", () => {
      it("로그인 요청을 성공하면, 상태코드 201을 반환합니다.", async () => {
        const response = await request(app.getHttpServer())
          .post("/login")
          .send({
            email: "gildong@naver.com",
          });
        expect(response.statusCode).toBe(201);

        accessToken = response.body.accessToken;
      });
      it("로그인 요청을 실패하면, 상태코드 404을 반환합니다.", async () => {
        const response = await request(app.getHttpServer())
          .post("/login")
          .send({
            email: "worng@naver.com",
          });
        expect(response.statusCode).toBe(404);
      });
      it("빈 문자열로 로그인 요청을 하면, 상태코드 400을 반환합니다.", async () => {
        const response = await request(app.getHttpServer())
          .post("/login")
          .send({
            email: "",
          });
        expect(response.statusCode).toBe(400);
      });
    });
  });

  describe("📌 게시글 테스트", () => {
    describe("POST /boards", () => {
      it("게시글을 작성하면, 상태코드 201을 반환합니다.", async () => {
        const response = await request(app.getHttpServer())
          .post("/boards")
          .set("Authorization", accessToken)
          .send({
            title: "오늘도 열공!!",
            content: "주말이 뭐죠??",
            hashTags: ["#주말", "#열공"],
          });
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe("오늘도 열공!!");
        expect(response.body.content).toBe("주말이 뭐죠??");
        expect(response.body.hashTags).toStrictEqual(["#주말", "#열공"]);
      });
      it("로그인하지 않았다면, 상태코드 400을 반환합니다.", async () => {
        const response = await request(app.getHttpServer())
          .post("/boards")
          .send({
            title: "오늘도 열공!!",
            content: "주말이 뭐죠??",
            hashTags: ["#주말", "#열공"],
          });
        expect(response.statusCode).toBe(400);
      });
      it("게시글을 작성하지 않고 요청을 보낸다면, 상태코드 400을 반환합니다.", async () => {
        const response = await request(app.getHttpServer())
          .post("/boards")
          .set("Authorization", accessToken)
          .send({
            content: "주말이 뭐죠??",
            hashTags: ["#주말", "#열공"],
          });
        expect(response.statusCode).toBe(400);
      });
      it("해쉬태그에 #을 추가하지 않는다면, 상태코드 400을 반환합니다.", async () => {
        const response = await request(app.getHttpServer())
          .post("/boards")
          .set("Authorization", accessToken)
          .send({
            title: "오늘도 열공!!",
            content: "주말이 뭐죠??",
            hashTags: ["주말", "열공"],
          });
        expect(response.statusCode).toBe(400);
      });
    });

    describe("GET /boards", () => {
      it("모든 게시글을 조회한다면, 상태코드 200을 반환합니다.", async () => {
        const response = await request(app.getHttpServer()).get(
          encodeURI("/boards"),
        );
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body[0].title).toBeDefined();
        expect(response.body[0].content).toBeDefined();
      });
      it("모든 게시글을 검색 조회한다면, 상태코드 200을 반환합니다.", async () => {
        const response = await request(app.getHttpServer()).get(
          encodeURI("/boards?search=오늘도"),
        );
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body[0].title).toBeDefined();
        expect(response.body[0].content).toBeDefined();
      });
      it("모든 게시글을 정렬 조회한다면, 상태코드 200을 반환합니다.", async () => {
        const response = await request(app.getHttpServer()).get(
          encodeURI("/boards?orderBy=desc"),
        );
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body[0].title).toBeDefined();
        expect(response.body[0].content).toBeDefined();
      });
      it("모든 게시글을 필터 조회한다면, 상태코드 200을 반환합니다.", async () => {
        const response = await request(app.getHttpServer()).get(
          encodeURI("/boards?filter=주말"),
        );
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body[0].title).toBeDefined();
        expect(response.body[0].content).toBeDefined();
      });
      it("모든 게시글의 수를 조정하여 조회한다면, 상태코드 200을 반환합니다.", async () => {
        const response = await request(app.getHttpServer()).get(
          encodeURI("/boards?page=1&limit=20"),
        );
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body[0].title).toBeDefined();
        expect(response.body[0].content).toBeDefined();
      });
      it("모든 게시글을 검색/정렬 조회한다면, 상태코드 200을 반환합니다.", async () => {
        const response = await request(app.getHttpServer()).get(
          encodeURI("/boards?search=오늘도&orderBy=desc"),
        );
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body[0].title).toBeDefined();
        expect(response.body[0].content).toBeDefined();
      });
      it("모든 게시글을 검색/정렬/조정하여 조회한다면, 상태코드 200을 반환합니다.", async () => {
        const response = await request(app.getHttpServer()).get(
          encodeURI("/boards?search=오늘도&orderBy=desc&page=1&limit=20"),
        );
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body[0].title).toBeDefined();
        expect(response.body[0].content).toBeDefined();
      });
      it("모든 게시글을 정렬/필터 조회한다면, 상태코드 200을 반환합니다.", async () => {
        const response = await request(app.getHttpServer()).get(
          encodeURI("/boards?orderBy=desc&filter=주말"),
        );
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body[0].title).toBeDefined();
        expect(response.body[0].content).toBeDefined();
      });
      it("모든 게시글을 정렬/필터/조정하여 조회한다면, 상태코드 200을 반환합니다.", async () => {
        const response = await request(app.getHttpServer()).get(
          encodeURI("/boards?orderBy=desc&filter=주말&page=1&limit=20"),
        );
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body[0].title).toBeDefined();
        expect(response.body[0].content).toBeDefined();
      });
      it("모든 게시글을 검색/필터 조회한다면, 상태코드 200을 반환합니다.", async () => {
        const response = await request(app.getHttpServer()).get(
          encodeURI("/boards?search=오늘도&filter=주말"),
        );
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body[0].title).toBeDefined();
        expect(response.body[0].content).toBeDefined();
      });
      it("모든 게시글을 검색/필터/조정하여 조회한다면, 상태코드 200을 반환합니다.", async () => {
        const response = await request(app.getHttpServer()).get(
          encodeURI("/boards?search=오늘도&filter=주말&page=1&limit=20"),
        );
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body[0].title).toBeDefined();
        expect(response.body[0].content).toBeDefined();
      });
      it("모든 게시글을 검색/정렬/필터 조회한다면, 상태코드 200을 반환합니다.", async () => {
        const response = await request(app.getHttpServer()).get(
          encodeURI("/boards?search=오늘도&orderBy=desc&filter=주말"),
        );
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body[0].title).toBeDefined();
        expect(response.body[0].content).toBeDefined();
      });
      it("모든 게시글을 검색/정렬/필터/조정하여 조회한다면, 상태코드 200을 반환합니다.", async () => {
        const response = await request(app.getHttpServer()).get(
          encodeURI(
            "/boards?search=오늘도&orderBy=desc&filter=주말&page=1&limit=20",
          ),
        );
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body[0].title).toBeDefined();
        expect(response.body[0].content).toBeDefined();
      });
    });

    describe("GET /boards/:id", () => {
      it("특정 게시글을 조회한다면, 상태코드 200을 반환합니다.", async () => {
        const response = await request(app.getHttpServer()).get(
          encodeURI("/boards/1"),
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe("오늘도 열공!!");
        expect(response.body.content).toBe("주말이 뭐죠??");
      });
      it("특정 게시글 조회를 실패하면, 상태코드 400을 반환합니다.", async () => {
        const response = await request(app.getHttpServer()).get(`/boards/000`);
        expect(response.statusCode).toBe(400);
      });
    });

    describe("PATCH /boards/:id", () => {
      it("특정 게시글을 수정한다면, 상태코드 200을 반환합니다.", async () => {
        const response = await request(app.getHttpServer())
          .patch("/boards/1")
          .set("Authorization", accessToken)
          .send({
            title: "열공!!",
          });
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe("열공!!");
        expect(response.body.content).toBe("주말이 뭐죠??");
      });
      it("로그인하지 않고 특정 게시글을 수정하면, 상태코드 400을 반환합니다.", async () => {
        const response = await request(app.getHttpServer())
          .patch(`/boards/1`)
          .send({ title: "열공!!" });
        expect(response.statusCode).toBe(400);
      });
      it("특정 게시글 수정을 실패하면, 상태코드 400을 반환합니다.", async () => {
        const response = await request(app.getHttpServer())
          .patch(`/boards/000`)
          .set("Authorization", accessToken)
          .send({ title: "열공!!" });
        expect(response.statusCode).toBe(400);
      });
    });

    describe("DELETE /boards/:id", () => {
      it("특정 게시글을 삭제한다면, 상태코드 200을 반환합니다.", async () => {
        const response = await request(app.getHttpServer())
          .delete("/boards/1")
          .set("Authorization", accessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({ id: 1 });
      });
      it("로그인하지 않고 특정 게시글을 삭제한다면, 상태코드 400을 반환합니다.", async () => {
        const response = await request(app.getHttpServer()).patch(`/boards/1`);
        expect(response.statusCode).toBe(400);
      });
      it("특정 게시글 삭제을 실패하면, 상태코드 400을 반환합니다.", async () => {
        const response = await request(app.getHttpServer()).patch(
          `/boards/000`,
        );
        expect(response.statusCode).toBe(400);
      });
    });

    describe("PATCH /boards/:id/restoration", () => {
      it("삭제된 특정 게시글을 복원한다면, 상태코드 200을 반환합니다.", async () => {
        const response = await request(app.getHttpServer())
          .patch("/boards/1/restoration")
          .set("Authorization", accessToken);
        expect(response.statusCode).toBe(200);
      });
      it("로그인하지 않고 특정 게시글을 복원한다면, 상태코드 400을 반환합니다.", async () => {
        const response = await request(app.getHttpServer()).patch(
          `/boards/1/restoration`,
        );
        expect(response.statusCode).toBe(400);
      });
      it("특정 게시글 복원을 실패하면, 상태코드 400을 반환합니다.", async () => {
        const response = await request(app.getHttpServer()).patch(
          `/boards/000/restoration`,
        );
        expect(response.statusCode).toBe(400);
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
