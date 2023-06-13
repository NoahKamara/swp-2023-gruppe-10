import { Session } from '../models/session';
import { CreateUser, User } from 'softwareproject-common';
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

  createUser(info: CreateUser): Promise<User> {
    const user: User = {
      id: this.users.length + 1,
      ...info
    };

    this.users.push(user);
    return Promise.resolve(user);
  }

  async updateUser(info: User): Promise<void> {
    const idx = this.users.findIndex(u => u.id === info.id);
    this.users[idx] = info;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = this.users.find(u => u.email === email);
    if (!user) return null;
    return Promise.resolve(user);
  }

  async getUserById(id: number): Promise<User | null> {
    const user = this.users.find(u => u.id === id);
    if (!user) return null;
    return Promise.resolve(user);
  }

  async createSession(userID: number): Promise<Session> {
    const sessionId = uid.sync(24);
    const session: Session = { sessionId: sessionId, userId: userID };

    // add to active sessions
    this.sessions.push(session);

    return Promise.resolve(session);
  }

  async getSession(sessionId: string): Promise<Session | null> {
    const session = this.sessions.find(s => s.sessionId === sessionId);
    if (!session) return null;
    return Promise.resolve(session);
  }

  async delSession(sessionId: string): Promise<void> {
    const index = this.sessions.findIndex(s => s.sessionId === sessionId);
    if (!index) return;
    this.sessions.splice(index, 1);
  }
}
