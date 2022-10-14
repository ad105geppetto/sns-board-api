import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Boards } from "./entities/boards.entity";
import { BoardHashTags } from "./entities/board_hashTags.entity";
import { HashTags } from "./entities/hashTag.entity";
import { BoardsController } from "./controllers/boards.controller";
import { BoardsService } from "./services/boards.service";
import { JwtModule } from "@nestjs/jwt";
import { Likes } from "./entities/likes.entity";

@Module({
  imports: [
    SequelizeModule.forFeature([Boards, HashTags, BoardHashTags, Likes]),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: "1d" },
    }),
  ],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
