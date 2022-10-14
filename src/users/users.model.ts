import {
  Column,
  Model,
  Table,
  HasMany,
  BelongsToMany,
} from "sequelize-typescript";
import { Likes } from "../boards/models/likes.model";
import { Boards } from "../boards/models/boards.model";

@Table({
  paranoid: true,
  timestamps: true,
  tableName: "users",
})
export class Users extends Model<Users> {
  @Column
  email: string;

  @HasMany(() => Boards)
  boards: Boards[];

  @BelongsToMany(() => Boards, () => Likes)
  boardsArr: Boards[];
}
