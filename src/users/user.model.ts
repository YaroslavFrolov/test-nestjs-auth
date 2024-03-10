import { DataTypes } from 'sequelize';
import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column({
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  })
  id: number;

  @Column({
    unique: {
      name: 'name',
      msg: 'This name already exist',
    },
  })
  name: string;

  @Column
  password: string;

  @Column({ type: DataTypes.JSON })
  roles: string;
}
