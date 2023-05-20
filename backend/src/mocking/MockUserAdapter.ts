import { Session } from '../models/session';
import { CreateUser, User } from 'softwareproject-common';
import { UserAdapter } from '../adapters/UserAdapter';
import uid from 'uid-safe';

/**
* Mocks the UserAdapter interface for development
*/
export class MockUserAdapter implements UserAdapter {
    users: User[] = [
        { id: 1, email: 'tulpe@uni.kn', password: '$2b$10$46nOBhJ3IsKJ7Cu.tP02rOCbWuNTkWIlD8oE/vCTRR3/OcBSiLruG', firstName: 'Thomas', lastName: 'Tulpe', street: 'Hauptstraße', number: '1', city: 'Konstanz', zipcode: '78467' }, // Passwort: test
        { id: 2, email: 'halm@uni.kn', password: '$2a$10$hPS.A0J.EQYg0.tRXMfyg.Dx5BsgDYvtAk4uoBts.dBvJs8Uoi7uu', firstName: 'Hanna', lastName: 'Halm', street: 'Hauptstraße', number: '1', city: 'Konstanz', zipcode: '78467' } // Passwort: blume
    ];

    sessions: Session[] = [];

    createUser(info: CreateUser): User {
        const user: User = {
            id: this.users.length + 1,
            ...info
        };

        this.users.push(user);
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
