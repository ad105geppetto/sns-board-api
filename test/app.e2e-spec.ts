import { Test, TestingModule } from "@nestjs/testing";
import { ValidationPipe } from "@nestjs/common";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";

describe("AppController (e2e)", () => {
  let app: INestApplication;

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
            email: "difkendiso",
          });
        expect(response.statusCode).toBe(400);
      });
    });
    describe("POST /login", () => {
      it("로그인 요청을 성공하면, 상태코드 201을 반환합니다.", () => {
        return request(app.getHttpServer())
          .post("/login")
          .send({
            email: "gildong@naver.com",
          })
          .expect(201);
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
