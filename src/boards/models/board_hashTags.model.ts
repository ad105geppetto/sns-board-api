import { Column, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Boards } from './boards.model';
import { HashTags } from './hashTag.model';

@Table({
  paranoid: true,
  timestamps: true,
  tableName: "board_hashTags"
})
export class BoardHashTags extends Model<BoardHashTags> {
  @Column
  @ForeignKey(() => Boards)
  board_id: number;

  @Column
  @ForeignKey(() => HashTags)
  hashTag_id: number;
}