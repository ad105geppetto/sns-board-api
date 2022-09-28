import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';
import { Users } from './users.model';
import { SignupController } from './controllers/signup.controller';
import { SignupService } from './services/signup.service';
import { LoginController } from './controllers/login.controller';
import { LoginService } from './services/login.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Users]),
  ],
  exports: [SequelizeModule],
  controllers: [SignupController, LoginController],
  providers: [SignupService, LoginService]
})
export class UsersModule { }
