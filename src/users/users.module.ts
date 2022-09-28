import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';
import { Users } from './users.model';
import { SignupController } from './controllers/signup.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Users]),
  ],
  exports: [SequelizeModule],
  controllers: [SignupController],
  providers: [UsersService]
})
export class UsersModule { }
