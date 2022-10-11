import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Boards } from "./models/boards.model";
import { BoardHashTags } from "./models/board_hashTags.model";
import { HashTags } from "./models/hashTag.model";
import { BoardsController } from "./boards.controller";
import { BoardsService } from "./boards.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    SequelizeModule.forFeature([Boards, HashTags, BoardHashTags]),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: "1d" },
    }),
  ],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
