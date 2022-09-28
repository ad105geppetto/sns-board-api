import { Controller, Post, Body } from '@nestjs/common';
import { UserInfoDTO } from '../dto/userInfo.dto';
import { LoginService } from '../services/login.service';

@Controller('login')
export class LoginController {
  constructor(private readonly UserService: LoginService) { }

  @Post()
  async login(@Body() userInfo: UserInfoDTO) {
    const user = await this.UserService.login(userInfo)
    return user
  }
}
