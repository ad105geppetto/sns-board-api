import { Controller, Post, Body } from '@nestjs/common';
import { UserInfoDTO } from '../dto/userInfo.dto';
import { UsersService } from '../users.service';

@Controller('signup')
export class SignupController {
  constructor(private readonly UserService: UsersService) { }

  @Post()
  async createUser(@Body() userInfo: UserInfoDTO) {
    const user = await this.UserService.create(userInfo)
    return user
  }
}
