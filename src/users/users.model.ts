import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  paranoid: true,
  timestamps: true,
  tableName: "users"
})
export class Users extends Model<Users> {
  @Column
  email: string;
}