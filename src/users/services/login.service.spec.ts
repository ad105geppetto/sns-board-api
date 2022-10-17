import { Test, TestingModule } from "@nestjs/testing";
import { LoginService } from "./login.service";
import { Users } from "../entities/users.entity";
import { getModelToken } from "@nestjs/sequelize";
import { NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

let loginService: LoginService;
let userInfo;
const mockUserModel = {
  findOne: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      LoginService,
      {
        provide: JwtService,
        useValue: mockJwtService,
      },
      {
        provide: getModelToken(Users),
        useValue: mockUserModel,
      },
    ],
  }).compile();

  loginService = module.get<LoginService>(LoginService);
});

describe("LoginService", () => {
  beforeEach(() => {
    userInfo = {
      email: "ㅁㅁ@naver.com",
    };
  });
  it("로그인 서비스 확인합니다", async () => {
    expect(loginService).toBeDefined();
  });
  it("로그인 함수(login) 확인합니다", async () => {
    expect(typeof loginService.login).toBe("function");
  });
  it("모델의 함수(findOne)를 호출할 수 있습니다", async () => {
    const findOne = mockUserModel.findOne.mockImplementationOnce(() => {
      return userInfo;
    });
    await loginService.login(userInfo);
    expect(findOne).toBeCalledWith({ where: userInfo });
  });
  it("로그인을 성공하면, JTW 토큰을 발급받을 수 있습니다", async () => {
    mockUserModel.findOne.mockImplementationOnce(() => {
      return userInfo;
    });
    mockJwtService.sign.mockImplementationOnce(() => {
      return "TOKEN";
    });
    expect(await loginService.login(userInfo)).toEqual({
      accessToken: "TOKEN",
    });
  });
  it("이메일이 존재하지 않는 경우, 에러를 반환합니다", async () => {
    mockUserModel.findOne.mockImplementationOnce(() => {
      return undefined;
    });
    try {
      await loginService.login(userInfo);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });
});
