import { Column, Model, Table, HasMany } from 'sequelize-typescript';
import { Boards } from 'src/boards/models/boards.model';

@Table({
  paranoid: true,
  timestamps: true,
  tableName: "users"
})
export class Users extends Model<Users> {
  @Column
  email: string;

  @HasMany(() => Boards)
  boards: Boards[];
}