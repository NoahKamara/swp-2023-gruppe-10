import { Session } from '../models/session';
import { CreateUser, User } from 'softwareproject-common';
import { UserAdapter } from '../adapters/UserAdapter';
import uid from 'uid-safe';
import { Sequelize } from 'sequelize-typescript';
import { DBUser } from '../models/db.user';

/**
* Mocks the UserAdapter interface for development
*/
export class DBUserAdapter implements UserAdapter {
    sessions: Session[] = [];

    // constructor(sequelize: Sequelize) {
    //     this.sequelize = sequelize;
    // }

    async createUser(info: CreateUser): Promise<User> {
        const user = await DBUser.create(info);
        return user;
    }

    async updateUser(info: User): Promise<void> {
        // const idx = this.users.findIndex(u => u.id === info.id);
        // this.users[idx] = info;
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return await DBUser.findOne({
            where: {
                email: email
            }
        });
    }

    async getUserById(id: number): Promise<User | null> {
        return await DBUser.findByPk(id);
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
