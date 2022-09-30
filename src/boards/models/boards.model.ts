import { Column, Model, Table, HasMany, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Users } from 'src/users/users.model';
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

  @HasMany(() => BoardHashTags)
  boardHashTags: BoardHashTags[];

  @BelongsTo(() => Users)
  users: Users
}