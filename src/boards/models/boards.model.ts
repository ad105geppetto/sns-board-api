import { Column, Model, Table, HasMany } from 'sequelize-typescript';
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

  @HasMany(() => HashTags)
  hashTags: HashTags[];
}