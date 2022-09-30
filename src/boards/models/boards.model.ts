import { Column, Model, Table, BelongsToMany, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Users } from '../../users/users.model';
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

  @Column
  @ForeignKey(() => Users)
  user_id: number;

  @Column
  views_count: number;

  @BelongsToMany(() => HashTags, () => BoardHashTags)
  hashTags: HashTags[]

  @BelongsTo(() => Users)
  users: Users
}