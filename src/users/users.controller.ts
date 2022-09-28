import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('signup')
export class UsersController {
  constructor(private readonly UserService: UsersService) { }

  @Post()
  async createUser(@Body() userInfo) {
    const user = await this.UserService.create(userInfo)
    return user
  }
}
