import { CreationOptional } from 'sequelize';
import { Table, Model, ForeignKey, BelongsTo, Column, PrimaryKey, DataType } from 'sequelize-typescript';
import { Event, User } from 'softwareproject-common';
import { DBEvent } from './db.event';
import { DBUser } from './db.user';
import { number } from 'zod';



@Table({ modelName: 'tickets', timestamps: false })
export class DBTicket extends Model {
  declare id: CreationOptional<number>;

  @ForeignKey(() => DBEvent)
  @Column
  event_id!: number;

  @ForeignKey(() => DBUser)
  @Column
  user_id!: number;

  @BelongsTo(() => DBEvent, 'event_id')
  event!: DBEvent;

  @BelongsTo(() => DBUser, 'user_id')
  user!: DBUser;

  // @Column
  // amount!: number;
}
