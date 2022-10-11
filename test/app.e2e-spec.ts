import { Test, TestingModule } from "@nestjs/testing";
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
    await app.init();
  });

  describe("📌 유저 테스트", () => {
    describe("/signup", () => {
      it("(POST) 회원가입 요청을 성공하면, 상태코드 201을 반환합니다.", () => {
        return request(app.getHttpServer())
          .post("/signup")
          .send({
            email: "gildong@naver.com",
          })
          .expect(201);
      });
    });
    describe("/login", () => {
      it("(POST) 로그인 요청을 성공하면, 상태코드 201을 반환합니다.", () => {
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
