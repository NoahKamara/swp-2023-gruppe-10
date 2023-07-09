import { CreationOptional } from 'sequelize';
import { Column, Table, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Session } from '../session';
import { DBUser } from '../user/user.db';
import { SessionFactory } from './session.factory';


@Table({ modelName: 'sessions', timestamps: false })
export class DBSession extends Model<Session> {
  declare id: CreationOptional<number>;

  static get factory(): SessionFactory<DBSession> {
    return {
      insert: DBSession.insert,
      byID: DBSession.byID,
      destroy: DBSession.delete
    };
  }
  @ForeignKey(() => DBUser)
  @Column
  user_id!: number;

  @BelongsTo(() => DBUser, 'user_id')
  user!: DBUser;

  @Column({ references: 'session_id' })
  session_id!: string;

  /**
  * Returns a DBSession from an sessionID
  *
  * @memberof DBSession
  * @static
  * @method
  * @param {string} sessionID - Session ID
  * @return {DBUser}
  */
  static async insert(data: Session): Promise<DBSession> {
    const session = await DBSession.create(data);
    return session;
  }

  /**
  * Returns a DBSession from an sessionID
  *
  * @memberof DBSession
  * @static
  * @method
  * @param {string} sessionID - Session ID
  * @return {DBUser}
  */
  static async byID(sessionID: string): Promise<DBSession> {
    const session = await DBSession.findOne({
      include: DBUser,
      where: {
        session_id: sessionID
      }
    });
    if (!session) {
      throw Error('No Session with that id');
    }

    return session;
  }

  static async delete(session: DBSession): Promise<void> {
    await session.destroy();
  }
}
