import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Boards } from './models/boards.model';
import { BoardHashTags } from './models/board_hashTags.model';
import { HashTags } from './models/hashTag.model';
import { BoardsController } from './boards.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([Boards, HashTags, BoardHashTags])
  ],
  controllers: [BoardsController]
})
export class BoardsModule { }
