import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';
import { Users } from './users.model';
import { UsersController } from './users.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([Users]),
  ],
  exports: [SequelizeModule],
  controllers: [UsersController]
})
export class UsersModule { }
