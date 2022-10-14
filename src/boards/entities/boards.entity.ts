import {
  Column,
  Model,
  Table,
  BelongsToMany,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import { Users } from "../../users/entities/users.entity";
import { BoardHashTags } from "./board_hashTags.entity";
import { HashTags } from "./hashTag.entity";
import { Likes } from "./likes.entity";

@Table({
  paranoid: true,
  timestamps: true,
  tableName: "boards",
})
export class Boards extends Model<Boards> {
  @Column
  title: string;

  @Column
  content: string;

  @Column
  @ForeignKey(() => Users)
  user_id: number;

  @Column
  views_count: number;

  @BelongsToMany(() => HashTags, () => BoardHashTags)
  hashTags: HashTags[];

  @BelongsTo(() => Users)
  users: Users;

  @BelongsToMany(() => Users, () => Likes)
  usersArr: Users[];
}
