import { CreationOptional } from 'sequelize';
import { Table, Model, ForeignKey, BelongsTo, Column } from 'sequelize-typescript';
import { DBEvent } from './event/event.db';
import { DBUser } from './user/user.db';



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

  @Column
  amount!: number;
}
