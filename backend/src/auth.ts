import { Request, Response, NextFunction } from 'express';
import { UserAdapter } from './adapters/UserAdapter';
import bcrypt from 'bcrypt';

import { validateBody } from './validation/requestValidation';
import { userInfoSchema, userLoginInfoSchema } from './validation/user';

export class AuthController {
  private userAdapter: UserAdapter;

  private salt: number | string = 10;

  /**
   * Brief description of the constructor here.
   *
   * @constructor
   * @param {UserAdapter} userAdapter - Brief description of the parameter here.
   */
  constructor({
    userAdapter,
    salt,
  }: {
    userAdapter: UserAdapter;
    salt: number | string;
  }) {
    this.userAdapter = userAdapter;
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
    const sess = this.userAdapter.getSession(sessionId);
    if (!sess) {
      next();
      return;
    }

    // get user by id
    const user = this.userAdapter.getUserById(sess.userId);
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
    const bodyData = validateBody(request, response, userInfoSchema);
    if (!bodyData) return;

    const password = bodyData.password;
    const passwordHash = bcrypt.hashSync(password, this.salt);
    const firstName = bodyData.firstName;
    const lastName = bodyData.lastName;
    const email = bodyData.email;

    const existingUser = this.userAdapter.getUserByEmail(email);
    if (existingUser) {
      response.status(400);
      response.send({ code: 400, message: 'User with Email already exists' });
      return;
    }

    // create user with controller
    const user = this.userAdapter.createUser({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: passwordHash,
    });

    // create session
    const session = this.userAdapter.createSession(user);

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
    const bodyData = validateBody(request, response, userLoginInfoSchema);
    if (!bodyData) return;

    const email: string = bodyData.email;
    const password: string = bodyData.password;

    // retrieve user
    const user = this.userAdapter.getUserByEmail(email);

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
    const session = this.userAdapter.createSession(user);

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
    console.log(sessionId);

    if (!sessionId) {
      response.send({ code: 400, message: 'Client did not send Session ID ' });
      return;
    }

    this.userAdapter.delSession(sessionId);

    // invalidate session cookie
    response.cookie('sessionId', null, { httpOnly: true, expires: new Date(0) });
    response.send({ code: 200, message: 'Logout successful' });
  }
}
