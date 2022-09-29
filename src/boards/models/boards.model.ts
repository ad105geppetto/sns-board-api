import { Column, Model, Table, HasMany } from 'sequelize-typescript';
import { BoardHashTags } from './board_hashTags.model';
import { HashTags } from './hashTag.model';

@Table({
  paranoid: true,
  timestamps: true,
  tableName: "boards"
})
export class Boards extends Model<Boards> {
  @Column
  title: string;

  @Column
  content: string;

  @HasMany(() => BoardHashTags)
  boardHashTags: BoardHashTags[];
}