import { Test, TestingModule } from "@nestjs/testing";
import { SignupController } from "./signup.controller";
import { SignupService } from "../services/signup.service";

let signupController: SignupController;
let userInfo;
const mockSignupService = {
  create: jest.fn(),
};

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [SignupController],
    providers: [SignupService],
  })
    .overrideProvider(SignupService)
    .useValue(mockSignupService)
    .compile();

  signupController = module.get<SignupController>(SignupController);
});

describe("SignupController", () => {
  beforeEach(() => {
    userInfo = {
      email: "ㅁㅁ@naver.com",
    };
  });
  it("회원가입 컨트롤러 확인합니다", async () => {
    expect(signupController).toBeDefined();
  });
  it("회원가입 함수(createUser) 확인합니다", async () => {
    expect(typeof signupController.createUser).toBe("function");
  });
  it("서비스의 회원가입 함수(create)를 호출할 수 있습니다", async () => {
    await signupController.createUser(userInfo);
    expect(mockSignupService.create).toBeCalledWith(userInfo);
  });
  it("회원가입할 수 있습니다", async () => {
    mockSignupService.create.mockReturnValue(userInfo);
    expect(await signupController.createUser(userInfo)).toStrictEqual(userInfo);
  });
});
