import { Column, Model, Table, HasMany } from 'sequelize-typescript';
import { Boards } from './boards.model';

@Table({
  paranoid: true,
  timestamps: true,
  tableName: "hashTags"
})
export class HashTags extends Model<HashTags> {
  @Column
  name: string;

  @HasMany(() => Boards)
  boards: Boards[];
}