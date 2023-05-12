import { Request, Response } from 'express';

import { UserController } from './controllers/UserController';
import { IDUser } from './models/user';
import { User } from './models/user';
import { Session } from './models/session';

import bcrypt from 'bcrypt';
import uid from 'uid-safe';

// import { User } from './models/user';
// import { Session } from './models/session';
// import uid from 'uid-safe';
// import bcrypt from 'bcrypt';


class MockUserController implements UserController {
    users: IDUser[] = [
        { id: 1, email: 'tulpe@uni.kn', password: '$2b$10$46nOBhJ3IsKJ7Cu.tP02rOCbWuNTkWIlD8oE/vCTRR3/OcBSiLruG', firstName: 'Thomas', lastName: 'Tulpe' }, // Passwort: test
        { id: 2, email: 'halm@uni.kn', password: '$2a$10$hPS.A0J.EQYg0.tRXMfyg.Dx5BsgDYvtAk4uoBts.dBvJs8Uoi7uu', firstName: 'Hanna', lastName: 'Halm' } // Passwort: blume
    ];

    sessions: Session[] = [];

    createUser(user: User): IDUser {
        const idUser: IDUser = { 
            id: this.users.length + 1, 
            ...user
        };

        this.users.push(idUser);
        return idUser;
    }

    createSession(user: IDUser): string {
        const sessionId = uid.sync(24);
        const session: Session = { sessionId: sessionId, userId: user.id };

        // add to active sessions
        this.sessions.push(session);

        return session.sessionId;
    }
}

export class AuthController {
    public userController: UserController;
    
    constructor(userController: UserController = new MockUserController()) {
        this.userController = userController;
    }

    /** 
    * Brief description of the function here.
    * @summary If the description is long, write your summary here. Otherwise, feel free to remove this.
    * @param {ParamDataTypeHere} parameterNameHere - Brief description of the parameter here. Note: For other notations of data types, please refer to JSDocs: DataTypes command.
    * @return {ReturnValueDataTypeHere} Brief description of the returning value here.
    */
    register = (request: Request, response: Response): void => {
        // hash pwd
        // request.body.json
        const password = request.body.password;
        const passwordHash = bcrypt.hashSync(password, 10);
        const firstName = request.body.firstName;
        const lastName = request.body.lastName;
        const email = request.body.email;

        // create user with controller
        const user = this.userController.createUser({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: passwordHash
        });

        // create session
        const sessionId = this.userController.createSession(user);

        response.status(200);
        response.cookie('sessionId', sessionId, { httpOnly: true });
        response.send({ code: 200, message: 'Login successful' });
        return;
    };
}
