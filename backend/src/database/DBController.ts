import { SessionFactory } from '../models/session/session.factory';
import { DBUser } from '../models/user/user.db';
import { UserFactory } from '../models/user/user.factory';
import { UserInterface } from '../models/user/user.interface';
import { SessionInterface } from '../models/session/session.interface';
import { DBSession } from '../models/session/session.db';
import { DBEvent, EventFactory, EventInterface } from '../models/event/event';
import { MockDBController } from './mock-controller';

export interface DBControllerInterface {
  get users(): UserFactory<UserInterface>
  get sessions(): SessionFactory<SessionInterface>
  get events(): EventFactory<EventInterface>
}

export class DBController {
  static get default(): DBControllerInterface {
    return new DBController();
  }

  static get mock(): DBControllerInterface {
    return new MockDBController();
  }

  get users(): UserFactory<UserInterface> {
    return DBUser.factory;
  }

  get sessions(): SessionFactory<SessionInterface> {
    return DBSession.factory;
  }

  get events(): EventFactory<EventInterface> {
    return DBEvent.factory;
  }
}




