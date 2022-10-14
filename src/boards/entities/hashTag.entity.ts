import { Column, Model, Table, BelongsToMany } from "sequelize-typescript";
import { Boards } from "./boards.entity";
import { BoardHashTags } from "./board_hashTags.entity";

@Table({
  paranoid: true,
  timestamps: true,
  tableName: "hashTags",
})
export class HashTags extends Model<HashTags> {
  @Column
  name: string;

  @BelongsToMany(() => Boards, () => BoardHashTags)
  boards: Boards[];
}
