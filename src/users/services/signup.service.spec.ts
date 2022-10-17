import { Test, TestingModule } from "@nestjs/testing";
import { SignupService } from "./signup.service";
import { Users } from "../entities/users.entity";
import { getModelToken } from "@nestjs/sequelize";
import { BadRequestException } from "@nestjs/common";

let signupService: SignupService;
let userInfo;
const mockUserModel = {
  findOrCreate: jest.fn(),
};

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      SignupService,
      {
        provide: getModelToken(Users),
        useValue: mockUserModel,
      },
    ],
  }).compile();

  signupService = module.get<SignupService>(SignupService);
});

describe("SignupService", () => {
  beforeEach(() => {
    userInfo = {
      email: "ㅁㅁ@naver.com",
    };
  });
  it("회원가입 서비스 확인합니다", async () => {
    expect(signupService).toBeDefined();
  });
  it("회원가입 함수(create) 확인합니다", async () => {
    expect(typeof signupService.create).toBe("function");
  });
  it("모델의 함수(findOrCreate)를 호출할 수 있습니다", async () => {
    const findOrCreate = mockUserModel.findOrCreate.mockImplementationOnce(
      () => {
        return [userInfo, true];
      },
    );
    await signupService.create(userInfo);
    expect(findOrCreate).toBeCalledWith({ where: userInfo });
  });
  it("회원가입할 수 있습니다", async () => {
    mockUserModel.findOrCreate.mockImplementationOnce(() => {
      return [userInfo, true];
    });
    expect(await signupService.create(userInfo)).toBe(userInfo);
  });
  it("회원이 존재하는 경우, 에러를 반환합니다", async () => {
    mockUserModel.findOrCreate.mockImplementationOnce(() => {
      return [userInfo, false];
    });
    try {
      await signupService.create(userInfo);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });
});
