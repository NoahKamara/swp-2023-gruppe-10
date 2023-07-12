import { CreationOptional } from 'sequelize';
import { Table, Model, ForeignKey, BelongsTo, Column, PrimaryKey, DataType } from 'sequelize-typescript';
import { Event, User } from 'softwareproject-common';
import { DBEvent } from './db.event';
import { DBUser } from './db.user';
import { number } from 'zod';
import { DBLocation } from './db.location';


@Table({ modelName: 'reviews', timestamps: false })
export class DBReview extends Model {
  declare id: CreationOptional<number>;

  @ForeignKey(() => DBUser)
  @Column
  user_id!: number;

  @ForeignKey(() => DBLocation)
  @Column
  location_id!: number;

  @ForeignKey(() => DBLocation)
  @Column
  location_name!: string;

  @BelongsTo(() => DBLocation, 'location_id')
  location!: DBLocation;

  @BelongsTo(() => DBUser, 'user_id')
  user!: DBUser;

  @Column
  stars!: number;

  @Column
  helpful!: number;

  @Column
  titel!: string;

  @Column
  comment!: string;






  // @Column
  // amount!: number;
}
