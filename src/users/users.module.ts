import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';
import { Users } from './users.model';
import { SignupController } from './controllers/signup.controller';
import { SignupService } from './services/signup.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Users]),
  ],
  exports: [SequelizeModule],
  controllers: [SignupController],
  providers: [SignupService]
})
export class UsersModule { }
