import { EventFactory } from '../models/event/event.factory';
import { SessionFactory } from '../models/session/session.factory';
import { SessionInterface } from '../models/session/session.interface';
import { UserFactory, UserInterface, MockUser, MockUserFactory } from '../models/user/user';
import { MockSession, MockSessionFactory } from '../models/session/session.mock';
import { DBControllerInterface } from './DBController';
import { EventInterface, MockEvent } from '../models/event/event';

export class MockDB {
  public users: MockUser[] = [];
  public sessions: MockSession[] = [];
  public events: MockEvent[] = [];
}

export class MockDBController implements DBControllerInterface {
  public db = new MockDB();

  get users(): UserFactory<UserInterface> {
    console.warn('using MockUserFactory');
    return new MockUserFactory(this);
  }

  get sessions(): SessionFactory<SessionInterface> {
    console.warn('using MockSessionFactory');
    return new MockSessionFactory(this);
  }

  get events(): EventFactory<EventInterface> {
    console.warn('using MockEventFactory');
    throw new Error('Method not implemented.');
  }
}
