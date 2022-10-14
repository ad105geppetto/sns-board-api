import { SequelizeModule } from "@nestjs/sequelize";
import { Module } from "@nestjs/common";
import { Users } from "./entities/users.entity";
import { SignupController } from "./controllers/signup.controller";
import { LoginController } from "./controllers/login.controller";
import { SignupService } from "./services/signup.service";
import { LoginService } from "./services/login.service";
import { JwtModule } from "@nestjs/jwt";
const dotenv = require("dotenv");
dotenv.config();

@Module({
  imports: [
    SequelizeModule.forFeature([Users]),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: "1d" },
    }),
  ],
  exports: [SequelizeModule],
  controllers: [SignupController, LoginController],
  providers: [SignupService, LoginService],
})
export class UsersModule {}
