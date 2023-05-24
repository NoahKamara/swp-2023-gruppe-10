import { Session } from '../models/session';
import { CreateUser, User } from 'softwareproject-common/src';
import { UserAdapter } from '../adapters/UserAdapter';
import uid from 'uid-safe';

/**
* Mocks the UserAdapter interface for development
*/
export class MockUserAdapter implements UserAdapter {
    users: User[] = [];

    sessions: Session[] = [];

    constructor() {
      this.users = [
        {
          id: 1,
          email: 'max.mustermann@email.com',
          password: '$2b$10$h5Q/lJlyz9SfOSITxfdGYetTXdayrXlx/W8nLrUe1Zq4.z0RQGD1S',
          street: 'Musterweg',
          number: '123',
          city: 'Musterstadt',
          zipcode: '12345',
          firstName: 'Max',
          lastName: 'Mustermann'
        }
      ];
    }

    createUser(info: CreateUser): User {
        const user: User = {
            id: this.users.length + 1,
            ...info
        };

        this.users.push(user);
        console.log(user);
        return user;
    }

    updateUser(info: User): void {
      const idx = this.users.findIndex(u => u.id === info.id);
      this.users[idx] = info;
  }

    getUserByEmail(email: string): User | undefined {
        return this.users.find(u => u.email === email);
    }

    getUserById(id: number): User | undefined {
        return this.users.find(u => u.id === id);
    }

    createSession(user: User): Session {
        const sessionId = uid.sync(24);
        const session: Session = { sessionId: sessionId, userId: user.id };

        // add to active sessions
        this.sessions.push(session);

        return session;
    }

    getSession(sessionId: string): Session | undefined {
        return this.sessions.find(s => s.sessionId === sessionId);
    }

    delSession(sessionId: string): void {
        const index = this.sessions.findIndex(s => s.sessionId === sessionId);
        if (!index) return;
        this.sessions.splice(index, 1);
    }
}
