import { Column, Model, Table, HasMany } from 'sequelize-typescript';
import { Boards } from './boards.model';
import { BoardHashTags } from './board_hashTags.model';

@Table({
  paranoid: true,
  timestamps: true,
  tableName: "hashTags"
})
export class HashTags extends Model<HashTags> {
  @Column
  name: string;

  @HasMany(() => BoardHashTags)
  boardHashTags: BoardHashTags[];
}