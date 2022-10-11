import { Controller, Post, Body } from "@nestjs/common";
import { UserInfoDTO } from "../dto/userInfo.dto";
import { SignupService } from "../services/signup.service";

@Controller("signup")
export class SignupController {
  constructor(private readonly signupService: SignupService) {}

  @Post()
  async createUser(@Body() userInfo: UserInfoDTO) {
    const user = await this.signupService.create(userInfo);
    return user;
  }
}
