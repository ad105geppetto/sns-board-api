import { Test, TestingModule } from "@nestjs/testing";
import { LoginController } from "./login.controller";
import { LoginService } from "../services/login.service";

let loginController: LoginController;
let userInfo;
const mockLoginService = {
  login: jest.fn(),
};

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [LoginController],
    providers: [LoginService],
  })
    .overrideProvider(LoginService)
    .useValue(mockLoginService)
    .compile();

  loginController = module.get<LoginController>(LoginController);
});

describe("LoginController", () => {
  beforeEach(() => {
    userInfo = {
      email: "ㅁㅁ@naver.com",
    };
  });
  it("로그인 컨트롤러 확인합니다", async () => {
    expect(loginController).toBeDefined();
  });
  it("로그인 함수(login) 확인합니다", async () => {
    expect(typeof loginController.login).toBe("function");
  });
  it("서비스의 로그인 함수를 호출할 수 있습니다", async () => {
    await loginController.login(userInfo);
    expect(mockLoginService.login).toBeCalledWith(userInfo);
  });
  it("로그인할 수 있습니다", async () => {
    mockLoginService.login.mockReturnValue(userInfo);
    expect(await loginController.login(userInfo)).toStrictEqual(userInfo);
  });
});
