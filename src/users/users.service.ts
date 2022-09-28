import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserInfoDTO } from './dto/userInfo.dto';
import { Users } from './users.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users) private userModel: typeof Users,
  ) { }

  async create(userInfo: UserInfoDTO) {
    const user = await this.userModel.create(userInfo);
    return user
  }
}
