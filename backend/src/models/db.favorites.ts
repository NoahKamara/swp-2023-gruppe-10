import { Table, Model, ForeignKey, BelongsTo, Column } from 'sequelize-typescript';
import { DBEvent } from './event/event';
import { DBUser } from './user/user';

@Table({ modelName: 'favorites', timestamps: false })
export class DBFavorites extends Model {

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
