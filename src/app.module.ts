import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { Users } from "./users/users.model";
import { BoardsModule } from "./boards/boards.module";
import { Boards } from "./boards/models/boards.model";
import { HashTags } from "./boards/models/hashTag.model";
import { BoardHashTags } from "./boards/models/board_hashTags.model";
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
      models: [Users, Boards, HashTags, BoardHashTags],
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
