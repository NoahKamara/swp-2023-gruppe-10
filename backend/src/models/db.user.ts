import { CreationOptional } from 'sequelize';
import { Table, Column, Model, HasMany } from 'sequelize-typescript';
import { CreateUser, User } from 'softwareproject-common';
import { DBTicket } from './db.ticket';

@Table({ modelName: 'users', timestamps: false })
export class DBUser extends Model<User, CreateUser> {
  declare id: CreationOptional<number>;

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

  @HasMany(() => DBTicket)
  tickets!: DBTicket[];
}


