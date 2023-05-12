import { Request, Response, NextFunction } from 'express';

import { UserController } from './controllers/UserController';
import { IDUser, User } from './models/user';
import { Session } from './models/session';
import bcrypt from 'bcrypt';
import uid from 'uid-safe';

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

    getUserByEmail(email: string): IDUser {
        return this.users.find(u => u.email === email);
    }

    getUserById(id: number): IDUser {
        return this.users.find(u => u.id === id);
    }

    createSession(user: IDUser): Session {
        const sessionId = uid.sync(24);
        const session: Session = { sessionId: sessionId, userId: user.id };

        // add to active sessions
        this.sessions.push(session);

        return session;
    }

    getSession(sessionId: string): Session {
        return this.sessions.find(s => s.sessionId === sessionId);
    }

    delSession(sessionId: string): void {
        const index = this.sessions.findIndex(s => s.sessionId === sessionId);
        if (!index) return;
        this.sessions.splice(index, 1);
    }
}

export class AuthController {
    private userController: UserController;

    private salt: number | string = 10;
    
    /**
    * Brief description of the constructor here.
    *
    * @constructor
    * @param {UserController} userController - Brief description of the parameter here.
    */
    constructor(userController: UserController = new MockUserController(), salt: number | string = 10) {
        this.userController = userController;
        this.salt = salt;
    }

    /** 
    * Authorize a user by session cookie
    */
    authorize(request: Request, response: Response, next: NextFunction): void {
        // get session id from cookies
        const sessionId = request.cookies.sessionId;
        if (!sessionId) {
            next();
            return;
        }

        // get session by id
        const sess = this.userController.getSession(sessionId);
        if (!sess) {
            next();
            return;
        }

        // get user by id
        const user = this.userController.getUserById(sess.userId);
        if (!user) {
            next();
            return;
        }

        response.locals.session = sess;
        response.locals.user = user;

        return next();
    }

    /** 
    * Create a new user
    */
    createUser(request: Request, response: Response): void {
        const password = request.body.password;
        const passwordHash = bcrypt.hashSync(password, this.salt);
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
        const session = this.userController.createSession(user);

        response.status(200);
        response.cookie('sessionId', session.sessionId, { httpOnly: true });
        response.send({ code: 200, message: 'Login successful' });
        return;
    }

    /** 
     *  returns true if the user is authorized, otherwise false
    */
    getAuth(request: Request, response: Response): void {
        if (!response.locals.session) {
            response.status(200);
            response.send(false);
            return;
        }

        response.status(200);
        response.send(true);
        return;
    }

    /** 
    * Login an existing user 
    */
    login(request: Request, response: Response): void {
        const email: string = request.body.email;
        const password: string = request.body.password;

        // retrieve user
        const user = this.userController.getUserByEmail(email);

        if (!user) {
            response.status(401);
            response.send({ code: 401, message: 'E-Mail address not found' });
            return;
        }

        // check password
        if (!bcrypt.compareSync(password, user.password)) {
            response.status(401);
            response.send({ code: 401, message: 'Wrong password' });
            return;
        }

        // create session token
        const session = this.userController.createSession(user);

        response.status(200);
        response.cookie('sessionId', session.sessionId, { httpOnly: true });
        response.send({ code: 200, message: 'Login successful' });
        return;
    }

    /** 
    * logout a currently logged in user
    */
    logout(request: Request, response: Response): void {
        const sessionId = request.cookies.sessionId;

        if (sessionId) {
            response.send({ code: 404, message: 'Logout failure: No Session with that ID' });
            return;
        }

        response.send({ code: 200, message: 'Logout successful' });
    }
}
