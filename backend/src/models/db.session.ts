import { CreationOptional } from 'sequelize';
import { Column, Table, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Session } from './session';
import { DBUser } from './db.user';



@Table({ modelName: 'sessions', timestamps: false })
export class DBSession extends Model {
  declare id: CreationOptional<number>;

  @ForeignKey(() => DBUser)
  @Column
  user_id!: number;

  @BelongsTo(() => DBUser, 'user_id')
  user!: DBUser;

  @Column({ references: 'session_id' })
  session_id!: string;

  public get sessionId(): string {
    return this.session_id;
  }
  public set sessionId(value: string) {
    this.session_id = value;
  }

  /**
  * Returns a DBSession from an id
  *
  * @memberof DBSession
  * @static
  * @method
  * @param {number} id - database id
  * @return {DBUser}
  */
  static async byID(id: number): Promise<DBSession> {
    const session = await DBSession.findOne({
      include: DBUser,
      where: {
        session_id: id
      }
    });
    if (!session) {
      throw Error('No Session with that id');
    }

    return session;
  }
}
