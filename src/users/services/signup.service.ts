import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { UserInfoDTO } from "../dto/userInfo.dto";
import { Users } from "../entities/users.entity";

@Injectable()
export class SignupService {
  constructor(@InjectModel(Users) private userModel: typeof Users) {}

  async create(userInfo: UserInfoDTO) {
    const user = await this.userModel.create(userInfo);
    return user;
  }
}
