import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppService } from './app.service';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      models: [],
      dialectOptions: {
        useUTC: false, //for reading from database
        dateStrings: true,
        typeCast: true,
        timezone: '+09:00',
      },
      timezone: "+09:00"
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
