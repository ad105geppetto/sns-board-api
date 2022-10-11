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
  });

  afterAll(async () => {
    await app.close();
  });
});
