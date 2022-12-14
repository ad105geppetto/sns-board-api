import { Column, Model, Table, ForeignKey } from "sequelize-typescript";
import { Boards } from "./boards.entity";
import { HashTags } from "./hashTag.entity";

@Table({
  paranoid: true,
  timestamps: true,
  tableName: "board_hashTags",
})
export class BoardHashTags extends Model<BoardHashTags> {
  @Column
  @ForeignKey(() => Boards)
  board_id: number;

  @Column
  @ForeignKey(() => HashTags)
  hashTag_id: number;
}
