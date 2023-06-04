import { Table, Column, Model } from 'sequelize-typescript';
import { CreateUser, User } from 'softwareproject-common';

@Table({modelName: 'users', timestamps: false})
export class DBUser extends Model<User,CreateUser> {
 @Column
  email!: string;

  @Column
  password!: string;

  @Column
  firstName!: string;

  @Column
  lastName!: string;

  @Column
  street!: string;

  @Column
  number!: string;

  @Column
  city!: string;

  @Column
  zipcode!: string;
}


