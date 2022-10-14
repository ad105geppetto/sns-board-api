import { Column, Model, Table, ForeignKey } from "sequelize-typescript";
import { Users } from "../../users/users.model";
import { Boards } from "./boards.model";

@Table({
  paranoid: true,
  timestamps: true,
  tableName: "likes",
})
export class Likes extends Model<Likes> {
  @Column
  @ForeignKey(() => Users)
  user_id: number;

  @Column
  @ForeignKey(() => Boards)
  board_id: number;
}
