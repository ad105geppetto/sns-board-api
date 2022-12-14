import { Test, TestingModule } from "@nestjs/testing";
import { ValidationPipe } from "@nestjs/common";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";

let app: INestApplication;
let accessToken: string;

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

describe("π μ μ  ν΅ν© νμ€νΈ", () => {
  describe("POST /signup", () => {
    it("νμκ°μ μμ²­μ μ±κ³΅νλ©΄, μνμ½λ 201μ λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer()).post("/signup").send({
        email: "gildong@naver.com",
      });
      expect(response.statusCode).toBe(201);
      expect(response.body.email).toBe("gildong@naver.com");
    });
    it("λμΌν μ΄λ©μΌμ μλ ₯νμ¬ νμκ°μ μμ²­μ νλ©΄, μνμ½λ 400μ λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer()).post("/signup").send({
        email: "gildong@naver.com",
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("λμΌν μ΄λ©μΌμ΄ μ‘΄μ¬ν©λλ€.");
    });
    it("νμκ°μ μμ²­μ μ€ν¨νλ©΄, μνμ½λ 400μ λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer()).post("/signup").send({
        email: "",
      });
      expect(response.statusCode).toBe(400);
    });
  });
  describe("POST /login", () => {
    it("λ‘κ·ΈμΈ μμ²­μ μ±κ³΅νλ©΄, μνμ½λ 201μ λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer()).post("/login").send({
        email: "gildong@naver.com",
      });
      expect(response.statusCode).toBe(201);

      accessToken = response.body.accessToken;
    });
    it("λ‘κ·ΈμΈ μμ²­μ μ€ν¨νλ©΄, μνμ½λ 404μ λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer()).post("/login").send({
        email: "worng@naver.com",
      });
      expect(response.statusCode).toBe(404);
    });
    it("λΉ λ¬Έμμ΄λ‘ λ‘κ·ΈμΈ μμ²­μ νλ©΄, μνμ½λ 400μ λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer()).post("/login").send({
        email: "",
      });
      expect(response.statusCode).toBe(400);
    });
  });
});

describe("π κ²μκΈ ν΅ν© νμ€νΈ", () => {
  describe("POST /boards", () => {
    it("κ²μκΈμ μμ±νλ©΄, μνμ½λ 201μ λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer())
        .post("/boards")
        .set("Authorization", accessToken)
        .send({
          title: "μ€λλ μ΄κ³΅!!",
          content: "μ£Όλ§μ΄ λ­μ£ ??",
          hashTags: ["#μ£Όλ§", "#μ΄κ³΅"],
        });
      expect(response.statusCode).toBe(201);
      expect(response.body.title).toBe("μ€λλ μ΄κ³΅!!");
      expect(response.body.content).toBe("μ£Όλ§μ΄ λ­μ£ ??");
      expect(response.body.hashTags).toStrictEqual(["#μ£Όλ§", "#μ΄κ³΅"]);
    });
    it("λ‘κ·ΈμΈνμ§ μμλ€λ©΄, μνμ½λ 400μ λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer())
        .post("/boards")
        .send({
          title: "μ€λλ μ΄κ³΅!!",
          content: "μ£Όλ§μ΄ λ­μ£ ??",
          hashTags: ["#μ£Όλ§", "#μ΄κ³΅"],
        });
      expect(response.statusCode).toBe(400);
    });
    it("κ²μκΈμ μμ±νμ§ μκ³  μμ²­μ λ³΄λΈλ€λ©΄, μνμ½λ 400μ λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer())
        .post("/boards")
        .set("Authorization", accessToken)
        .send({
          content: "μ£Όλ§μ΄ λ­μ£ ??",
          hashTags: ["#μ£Όλ§", "#μ΄κ³΅"],
        });
      expect(response.statusCode).toBe(400);
    });
    it("ν΄μ¬νκ·Έμ #μ μΆκ°νμ§ μλλ€λ©΄, μνμ½λ 400μ λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer())
        .post("/boards")
        .set("Authorization", accessToken)
        .send({
          title: "μ€λλ μ΄κ³΅!!",
          content: "μ£Όλ§μ΄ λ­μ£ ??",
          hashTags: ["μ£Όλ§", "μ΄κ³΅"],
        });
      expect(response.statusCode).toBe(400);
    });
  });

  describe("GET /boards", () => {
    it("λͺ¨λ  κ²μκΈμ μ‘°ννλ€λ©΄, μνμ½λ 200μ λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer()).get(
        encodeURI("/boards"),
      );
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body[0].title).toBeDefined();
      expect(response.body[0].views_count).toBeDefined();
      expect(response.body[0].author).toBeDefined();
      expect(response.body[0].likes_count).toBeDefined();
      expect(Array.isArray(response.body[0].hashTags)).toBeTruthy();
    });
    it("λͺ¨λ  κ²μκΈμ κ²μ μ‘°ννλ€λ©΄, μνμ½λ 200μ λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer()).get(
        encodeURI("/boards?search=μ€λλ"),
      );
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body[0].title).toBeDefined();
      expect(response.body[0].views_count).toBeDefined();
      expect(response.body[0].author).toBeDefined();
      expect(response.body[0].likes_count).toBeDefined();
      expect(Array.isArray(response.body[0].hashTags)).toBeTruthy();
    });
    it("λͺ¨λ  κ²μκΈμ μ λ ¬ μ‘°ννλ€λ©΄, μνμ½λ 200μ λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer()).get(
        encodeURI("/boards?orderBy=desc"),
      );
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body[0].title).toBeDefined();
      expect(response.body[0].views_count).toBeDefined();
      expect(response.body[0].author).toBeDefined();
      expect(response.body[0].likes_count).toBeDefined();
      expect(Array.isArray(response.body[0].hashTags)).toBeTruthy();
    });
    it("λͺ¨λ  κ²μκΈμ νν° μ‘°ννλ€λ©΄, μνμ½λ 200μ λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer()).get(
        encodeURI("/boards?filter=μ£Όλ§"),
      );
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body[0].title).toBeDefined();
      expect(response.body[0].views_count).toBeDefined();
      expect(response.body[0].author).toBeDefined();
      expect(response.body[0].likes_count).toBeDefined();
      expect(Array.isArray(response.body[0].hashTags)).toBeTruthy();
    });
    it("λͺ¨λ  κ²μκΈμ μλ₯Ό μ‘°μ νμ¬ μ‘°ννλ€λ©΄, μνμ½λ 200μ λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer()).get(
        encodeURI("/boards?page=1&limit=20"),
      );
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body[0].title).toBeDefined();
      expect(response.body[0].views_count).toBeDefined();
      expect(response.body[0].author).toBeDefined();
      expect(response.body[0].likes_count).toBeDefined();
      expect(Array.isArray(response.body[0].hashTags)).toBeTruthy();
    });
    it("λͺ¨λ  κ²μκΈμ κ²μ/μ λ ¬ μ‘°ννλ€λ©΄, μνμ½λ 200μ λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer()).get(
        encodeURI("/boards?search=μ€λλ&orderBy=desc"),
      );
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body[0].title).toBeDefined();
      expect(response.body[0].views_count).toBeDefined();
      expect(response.body[0].author).toBeDefined();
      expect(response.body[0].likes_count).toBeDefined();
      expect(Array.isArray(response.body[0].hashTags)).toBeTruthy();
    });
    it("λͺ¨λ  κ²μκΈμ κ²μ/μ λ ¬/μ‘°μ νμ¬ μ‘°ννλ€λ©΄, μνμ½λ 200μ λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer()).get(
        encodeURI("/boards?search=μ€λλ&orderBy=desc&page=1&limit=20"),
      );
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body[0].title).toBeDefined();
      expect(response.body[0].views_count).toBeDefined();
      expect(response.body[0].author).toBeDefined();
      expect(response.body[0].likes_count).toBeDefined();
      expect(Array.isArray(response.body[0].hashTags)).toBeTruthy();
    });
    it("λͺ¨λ  κ²μκΈμ μ λ ¬/νν° μ‘°ννλ€λ©΄, μνμ½λ 200μ λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer()).get(
        encodeURI("/boards?orderBy=desc&filter=μ£Όλ§"),
      );
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body[0].title).toBeDefined();
      expect(response.body[0].views_count).toBeDefined();
      expect(response.body[0].author).toBeDefined();
      expect(response.body[0].likes_count).toBeDefined();
      expect(Array.isArray(response.body[0].hashTags)).toBeTruthy();
    });
    it("λͺ¨λ  κ²μκΈμ μ λ ¬/νν°/μ‘°μ νμ¬ μ‘°ννλ€λ©΄, μνμ½λ 200μ λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer()).get(
        encodeURI("/boards?orderBy=desc&filter=μ£Όλ§&page=1&limit=20"),
      );
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body[0].title).toBeDefined();
      expect(response.body[0].views_count).toBeDefined();
      expect(response.body[0].author).toBeDefined();
      expect(response.body[0].likes_count).toBeDefined();
      expect(Array.isArray(response.body[0].hashTags)).toBeTruthy();
    });
    it("λͺ¨λ  κ²μκΈμ κ²μ/νν° μ‘°ννλ€λ©΄, μνμ½λ 200μ λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer()).get(
        encodeURI("/boards?search=μ€λλ&filter=μ£Όλ§"),
      );
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body[0].title).toBeDefined();
      expect(response.body[0].views_count).toBeDefined();
      expect(response.body[0].author).toBeDefined();
      expect(response.body[0].likes_count).toBeDefined();
      expect(Array.isArray(response.body[0].hashTags)).toBeTruthy();
    });
    it("λͺ¨λ  κ²μκΈμ κ²μ/νν°/μ‘°μ νμ¬ μ‘°ννλ€λ©΄, μνμ½λ 200μ λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer()).get(
        encodeURI("/boards?search=μ€λλ&filter=μ£Όλ§&page=1&limit=20"),
      );
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body[0].title).toBeDefined();
      expect(response.body[0].views_count).toBeDefined();
      expect(response.body[0].author).toBeDefined();
      expect(response.body[0].likes_count).toBeDefined();
      expect(Array.isArray(response.body[0].hashTags)).toBeTruthy();
    });
    it("λͺ¨λ  κ²μκΈμ κ²μ/μ λ ¬/νν° μ‘°ννλ€λ©΄, μνμ½λ 200μ λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer()).get(
        encodeURI("/boards?search=μ€λλ&orderBy=desc&filter=μ£Όλ§"),
      );
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body[0].title).toBeDefined();
      expect(response.body[0].views_count).toBeDefined();
      expect(response.body[0].author).toBeDefined();
      expect(response.body[0].likes_count).toBeDefined();
      expect(Array.isArray(response.body[0].hashTags)).toBeTruthy();
    });
    it("λͺ¨λ  κ²μκΈμ κ²μ/μ λ ¬/νν°/μ‘°μ νμ¬ μ‘°ννλ€λ©΄, μνμ½λ 200μ λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer()).get(
        encodeURI(
          "/boards?search=μ€λλ&orderBy=desc&filter=μ£Όλ§&page=1&limit=20",
        ),
      );
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body[0].title).toBeDefined();
      expect(response.body[0].views_count).toBeDefined();
      expect(response.body[0].author).toBeDefined();
      expect(response.body[0].likes_count).toBeDefined();
      expect(Array.isArray(response.body[0].hashTags)).toBeTruthy();
    });
  });

  describe("GET /boards/:id", () => {
    it("νΉμ  κ²μκΈμ μ‘°ννλ€λ©΄, μνμ½λ 200μ λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer()).get(
        encodeURI("/boards/1"),
      );
      expect(response.statusCode).toBe(200);
      expect(response.body.title).toBe("μ€λλ μ΄κ³΅!!");
      expect(response.body.content).toBe("μ£Όλ§μ΄ λ­μ£ ??");
    });
    it("νΉμ  κ²μκΈ μ‘°νλ₯Ό μ€ν¨νλ©΄, μνμ½λ 404μ λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer()).get(`/boards/000`);
      expect(response.statusCode).toBe(404);
    });
  });

  describe("PATCH /boards/:id", () => {
    it("νΉμ  κ²μκΈμ μμ νλ€λ©΄, μνμ½λ 200μ λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer())
        .patch("/boards/1")
        .set("Authorization", accessToken)
        .send({
          title: "μ΄κ³΅!!",
        });
      expect(response.statusCode).toBe(200);
      expect(response.body.title).toBe("μ΄κ³΅!!");
      expect(response.body.content).toBe("μ£Όλ§μ΄ λ­μ£ ??");
    });
    it("λ‘κ·ΈμΈνμ§ μκ³  νΉμ  κ²μκΈμ μμ νλ©΄, μνμ½λ 400μ λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer())
        .patch(`/boards/1`)
        .send({ title: "μ΄κ³΅!!" });
      expect(response.statusCode).toBe(400);
    });
    it("νΉμ  κ²μκΈ μμ μ μ€ν¨νλ©΄, μνμ½λ 404μ λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer())
        .patch(`/boards/000`)
        .set("Authorization", accessToken)
        .send({ title: "μ΄κ³΅!!" });
      expect(response.statusCode).toBe(404);
    });
  });

  describe("DELETE /boards/:id", () => {
    it("νΉμ  κ²μκΈμ μ­μ νλ€λ©΄, μνμ½λ 200μ λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer())
        .delete("/boards/1")
        .set("Authorization", accessToken);
      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({ id: 1 });
    });
    it("λ‘κ·ΈμΈνμ§ μκ³  νΉμ  κ²μκΈμ μ­μ νλ€λ©΄, μνμ½λ 400μ λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer()).delete(`/boards/1`);
      expect(response.statusCode).toBe(400);
    });
    it("νΉμ  κ²μκΈ μ­μ μ μ€ν¨νλ©΄, μνμ½λ 400μ λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer()).delete(`/boards/000`);
      expect(response.statusCode).toBe(400);
    });
  });

  describe("PATCH /boards/:id/restoration", () => {
    it("μ­μ λ νΉμ  κ²μκΈμ λ³΅μνλ€λ©΄, μνμ½λ 200μ λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer())
        .patch("/boards/1/restoration")
        .set("Authorization", accessToken);
      expect(response.statusCode).toBe(200);
    });
    it("λ‘κ·ΈμΈνμ§ μκ³  νΉμ  κ²μκΈμ λ³΅μνλ€λ©΄, μνμ½λ 400μ λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer()).patch(
        `/boards/1/restoration`,
      );
      expect(response.statusCode).toBe(400);
    });
    it("νΉμ  κ²μκΈ λ³΅μμ μ€ν¨νλ©΄, μνμ½λ 400μ λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer()).patch(
        `/boards/000/restoration`,
      );
      expect(response.statusCode).toBe(400);
    });
  });

  describe("POST /boards/:id/likes", () => {
    it("νΉμ  κ²μκΈμμ μ’μμλ₯Ό ν΄λ¦­νλ€λ©΄, μνμ½λ 200κ³Ό success λ©μΈμ§λ₯Ό λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer())
        .post("/boards/1/likes")
        .set("Authorization", accessToken);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("success");
    });
    it("μ’μμλ₯Ό λ€μ ν΄λ¦­νλ€λ©΄, μνμ½λ 200κ³Ό cancel λ©μΈμ§λ₯Ό λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer())
        .post("/boards/1/likes")
        .set("Authorization", accessToken);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("cancel");
    });
    it("λ‘κ·ΈμΈνμ§ μκ³  μ’μμλ₯Ό ν΄λ¦­νλ€λ©΄, μνμ½λ 400μ λ°νν©λλ€.", async () => {
      const response = await request(app.getHttpServer()).post(
        `/boards/1/likes`,
      );
      expect(response.statusCode).toBe(400);
    });
  });
});

afterAll(async () => {
  await app.close();
});
