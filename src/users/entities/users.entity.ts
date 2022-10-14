import {
  Column,
  Model,
  Table,
  HasMany,
  BelongsToMany,
} from "sequelize-typescript";
import { Likes } from "../../boards/entities/likes.entity";
import { Boards } from "../../boards/entities/boards.entity";

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
