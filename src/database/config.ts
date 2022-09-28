const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  "development": {
    "username": process.env.MYSQL_USERNAME,
    "password": process.env.MYSQL_PASSWORD,
    "database": process.env.MYSQL_DATABASE,
    "host": process.env.MYSQL_HOST,
    "port": parseInt(process.env.MYSQL_PORT),
    "dialect": "mysql",
    "dialectOptions": {
      "useUTC": false, //for reading from database
      "dateStrings": true,
      "typeCast": true,
      "timezone": '+09:00',
    },
    "timezone": "+09:00"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "sns",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "sns",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
