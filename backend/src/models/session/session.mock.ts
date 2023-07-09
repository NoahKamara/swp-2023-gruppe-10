import { Session } from '../session';
import { MockDBController } from '../../database/mock-controller';
import { SessionFactory } from './session.factory';
import { SessionInterface } from './session.interface';




export class MockSessionFactory implements SessionFactory<MockSession> {
  constructor(private controller: MockDBController) { }

  insert(data: Session): Promise<MockSession> {
    const session = new MockSession(data, this.controller);
    if (!session) {
      throw Error('Not Found');
    }

    return Promise.resolve(session);
  }

  byID(sessionID: string): Promise<MockSession> {
    const session = this.controller.db.sessions.find(sess => { sess.session_id === sessionID; });
    if (!session) {
      throw Error('Not Found');
    }

    return Promise.resolve(session);
  }

  destroy(session: MockSession): Promise<void> {
    const idx = this.controller.db.sessions.findIndex(sess => sess === session);
    if (!idx) {
      throw Error('not found');
    }

    this.controller.db.sessions.splice(idx)[0];

    return Promise.resolve();
  }
}

export class MockSession implements SessionInterface, Session {
  session_id: string;
  user_id: number;
  private controller: MockDBController;

  constructor(session: Session, controller: MockDBController) {
    this.session_id = session.session_id;
    this.user_id = session.user_id;
    this.controller = controller;
  }

  // destroy(): Promise<void> {
  //   this.controller.sessions
  // }
}
