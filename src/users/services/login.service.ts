import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { UserInfoDTO } from "../dto/userInfo.dto";
import { JwtService } from "@nestjs/jwt";
import { Users } from "../users.model";

@Injectable()
export class LoginService {
  constructor(
    @InjectModel(Users) private userModel: typeof Users,
    private jwtService: JwtService,
  ) {}

  async login(userInfo: UserInfoDTO) {
    const email = userInfo.email;
    const user = await this.userModel.findOne({ where: { email: email } });

    if (!user) {
      throw new NotFoundException("이메일이 존재하지 않습니다.");
    }

    const token = this.jwtService.sign({ id: user.id });
    return { accessToken: token };
  }
}
