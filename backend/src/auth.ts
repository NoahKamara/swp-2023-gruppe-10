import { Request, Response, NextFunction } from 'express';
import { UserAdapter } from './adapters/UserAdapter';
import bcrypt from 'bcrypt';

import { validateBody } from './validation/requestValidation';
import { createUserSchema, updatePasswordSchema, userAddressSchema, userCredentialsSchema, userNameSchema } from './validation/user';
import { PublicUser, User } from 'softwareproject-common';


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
    const userInfo = validateBody(request, response, createUserSchema);
    if (!userInfo) return;
    const pwdHash = bcrypt.hashSync(userInfo.password, this.salt);

    userInfo.password = pwdHash;

    const existingUser = this.userAdapter.getUserByEmail(userInfo.email);
    if (existingUser) {
      response.status(400);
      response.send({ code: 400, message: 'Nutzer mit Email existiert bereits' });
      return;
    }

    // create user with controller
    const user = this.userAdapter.createUser(userInfo);

    // create session
    const session = this.userAdapter.createSession(user);

    response.status(200);
    response.cookie('sessionId', session.sessionId, { httpOnly: true });
    response.send({ code: 200, message: 'Registrierung erfolgreich' });
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
   *  returns user info if they are authorized
   */
  getUser(request: Request, response: Response): void {
    const user: User = response.locals.user;

    if (!user) {
      response.status(200);
      response.send({
        code: 401,
        message: 'Unauthorized'
      });
      return;
    }

    const publicUser: PublicUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      street: user.street,
      number: user.number,
      city: user.city,
      zipcode: user.zipcode
    };

    response.status(200);
    response.send(publicUser);
    return;
  }

  /**
   *  update user name info
   */
  updateName(request: Request, response: Response): void {
    const data = validateBody(request, response, userNameSchema);
    if (!data) return;

    const user: User = response.locals.user;

    if (!user) {
      response.status(200);
      response.send({
        code: 401,
        message: 'Unauthorized'
      });
      return;
    }

    const newUser: User = {
      ...user,
      ...data
    };

    this.userAdapter.updateUser(newUser);

    response.status(200);
    response.send({
      code: 200,
      message: 'User Names where Updated'
    });
    return;
  }

  /**
   *  update user address info
   */
  updateAddress(request: Request, response: Response): void {
    const data = validateBody(request, response, userAddressSchema);
    if (!data) return;

    const user: User = response.locals.user;

    if (!user) {
      response.status(200);
      response.send({
        code: 401,
        message: 'Unauthorized'
      });
      return;
    }

    const newUser: User = {
      ...user,
      ...data
    };

    this.userAdapter.updateUser(newUser);

    response.status(200);
    response.send({
      code: 200,
      message: 'User Names where Updated'
    });
    return;
  }

  /**
   *  update user password info
   */
  updatePassword(request: Request, response: Response): void {
    const data = validateBody(request, response, updatePasswordSchema);
    if (!data) return;

    const user: User = response.locals.user;

    if (!user) {
      response.status(200);
      response.send({
        code: 401,
        message: 'Unauthorized'
      });
      return;
    }

    if (!bcrypt.compareSync(data.oldPassword, user.password)) {
      response.status(401);
      response.send({
        code: 401,
        message: 'Passwort inkorrekt'
      });
      return;
    }

    const pwdHash = bcrypt.hashSync(data.newPassword, this.salt);
    const newUser: User = {
      ...user,
      password: pwdHash
    };

    this.userAdapter.updateUser(newUser);

    response.status(200);
    response.send({
      code: 200,
      message: 'User Names where Updated'
    });
    return;
  }

  /**
   * Login an existing user
   */
  login(request: Request, response: Response): void {
    console.log(request.body);
    const bodyData = validateBody(request, response, userCredentialsSchema);
    if (!bodyData) return;

    console.log(bodyData);
    const email: string = bodyData.email;
    const password: string = bodyData.password;

    // retrieve user
    const user = this.userAdapter.getUserByEmail(email);

    if (!user) {
      response.status(401);
      response.send({ code: 401, message: 'Es existiert kein Nutzer zu dieser Email' });
      return;
    }

    // check password
    if (!bcrypt.compareSync(password, user.password)) {
      response.status(401);
      response.send({ code: 401, message: 'Passwort stimmt nicht überein' });
      return;
    }

    // create session token
    const session = this.userAdapter.createSession(user);

    response.status(200);
    response.cookie('sessionId', session.sessionId, { httpOnly: true });
    response.send({ code: 200, message: 'Anmeldung erfolgreich' });
    return;
  }

  /**
   * logout a currently logged in user
   */
  logout(request: Request, response: Response): void {
    const sessionId = request.cookies.sessionId;

    console.log('session', sessionId);

    if (!sessionId) {
      response.status(400);
      response.send({ code: 400, message: 'Client did not send Session ID' });
      return;
    }


    this.userAdapter.delSession(sessionId);

    // invalidate session cookie
    response.cookie('sessionId', null, { httpOnly: true, expires: new Date(0) });
    response.send({ code: 200, message: 'Logout successful' });
  }
}
