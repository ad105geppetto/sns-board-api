import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Users } from './users.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users) private userModel: typeof Users,
  ) { }

  async create(userInfo) {
    const user = await this.userModel.create(userInfo);
    return user
  }
}
