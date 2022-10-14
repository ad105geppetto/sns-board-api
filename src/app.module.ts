import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UsersModule } from "./users/users.module";
import { Users } from "./users/entities/users.entity";
import { BoardsModule } from "./boards/boards.module";
import { Boards } from "./boards/entities/boards.entity";
import { HashTags } from "./boards/entities/hashTag.entity";
import { BoardHashTags } from "./boards/entities/board_hashTags.entity";
import { Likes } from "./boards/entities/likes.entity";
const dotenv = require("dotenv");
dotenv.config();

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: "mysql",
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      models: [Users, Boards, HashTags, BoardHashTags, Likes],
      dialectOptions: {
        useUTC: false, //for reading from database
        dateStrings: true,
        typeCast: true,
        timezone: "+09:00",
      },
      timezone: "+09:00",
    }),
    UsersModule,
    BoardsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
