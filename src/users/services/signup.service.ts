import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { UserInfoDTO } from "../dto/userInfo.dto";
import { Users } from "../entities/users.entity";

@Injectable()
export class SignupService {
  constructor(@InjectModel(Users) private userModel: typeof Users) {}

  async create(userInfo: UserInfoDTO) {
    const email = userInfo.email;
    const [user, created] = await this.userModel.findOrCreate({
      where: { email: email },
    });

    if (created) {
      return user;
    } else {
      throw new BadRequestException("동일한 이메일이 존재합니다.");
    }
  }
}
