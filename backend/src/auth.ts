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
  async authorize(request: Request, response: Response, next: NextFunction): Promise<void> {
    response.locals.session = null;
    response.locals.user = null;

    // get session id from cookies
    const sessionId = request.cookies.sessionId;
    if (!sessionId) {
      request.logger.warn('authorization: failure - no session id in header');
      next();
      return;
    }

    // get session by id
    const sess = await this.userAdapter.getSession(sessionId);
    if (!sess) {
      request.logger.warn(`authorization: failure - unknown session sessId='${sessionId}' `);
      next();
      return;
    }

    // get user by id
    const user = await this.userAdapter.getUserById(sess.userId);

    if (!user) {
      request.logger.warn(`authorization: failure - unknown user sessId='${sessionId}' userID='${sess.userId}'`);
      next();
      return;
    }

    request.logger.info(`authorization: success - sessId='${sess.sessionId}' userID='${user.id}'`);

    response.locals.session = sess;
    response.locals.user = user;

    return next();
  }

  /**
   * Create a new user
   */
  async createUser(request: Request, response: Response): Promise<void> {
    const userInfo = validateBody(request, response, createUserSchema);
    if (!userInfo) return;
    const pwdHash = bcrypt.hashSync(userInfo.password, this.salt);

    userInfo.password = pwdHash;

    const existingUser = await this.userAdapter.getUserByEmail(userInfo.email);
    if (existingUser) {
      response.status(400);
      response.send({ code: 400, message: 'Nutzer mit Email existiert bereits' });
      return;
    }

    try {
      // create user with controller
      const user = await this.userAdapter.createUser(userInfo);

      if (!user.id) {
        response.status(500);
        response.send({ code: 500, message: 'Nutzer hat keine ID' });
        return;
      }

      // create session
      const session = await this.userAdapter.createSession(user.id);

      response.status(200);
      response.cookie('sessionId', session.sessionId, { httpOnly: true });
      response.send({ code: 200, message: 'Registrierung erfolgreich' });
      return;
    } catch (err) {
      request.logger.error(err);
      response.send({ code: 500, message: err });
    }
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

    if (!user || !user.id) {
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
  async updateName(request: Request, response: Response): Promise<void> {
    const data = validateBody(request, response, userNameSchema);
    if (!data) return;

    const user: User = response.locals.user;

    if (!user) {
      response.status(401);
      response.send({
        code: 401,
        message: 'Unauthorized'
      });
      return;
    }

    user.firstName = data.firstName;
    user.lastName = data.lastName;

    try {
      await this.userAdapter.updateUser(user);

      response.status(200);
      response.send({
        code: 200,
        message: 'User Names where Updated'
      });
    } catch (err) {
      request.logger.error(err);
      response.status(500);
      response.send({
        code: 500,
        error: err,
        message: 'Internal Server Error'
      });
    }
  }

  /**
   *  update user address info
   */
  async updateAddress(request: Request, response: Response): Promise<void> {
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

    user.street = data.street;
    user.number = data.number;
    user.city = data.city;
    user.zipcode = data.zipcode;

    try {
      await this.userAdapter.updateUser(user);

      response.status(200);
      response.send({
        code: 200,
        message: 'User Address was Updated'
      });
    } catch (err) {
      request.logger.error(err);
      response.status(500);
      response.send({
        code: 500,
        error: err,
        message: 'Internal Server Error'
      });
    }
  }

  /**
   *  update user password info
   */
  async updatePassword(request: Request, response: Response): Promise<void> {
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

    user.password = bcrypt.hashSync(data.newPassword, this.salt);

    try {
      await this.userAdapter.updateUser(user);

      response.status(200);
      response.send({
        code: 200,
        message: 'User Address was Updated'
      });
    } catch (err) {
      request.logger.error(err);
      response.status(500);
      response.send({
        code: 500,
        error: err,
        message: 'Internal Server Error'
      });
    }
  }

  /**
   * Login an existing user
   */
  async login(request: Request, response: Response): Promise<void> {
    request.logger.info(request.body);
    const bodyData = validateBody(request, response, userCredentialsSchema);
    if (!bodyData) return;

    request.logger.info(bodyData);
    const email: string = bodyData.email;
    const password: string = bodyData.password;

    // retrieve user
    const user = await this.userAdapter.getUserByEmail(email);

    request.logger.info(email, user);
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

    if (!user.id) {
      response.status(500);
      response.send({ code: 500, message: 'Nutzer hat keine ID' });
      return;
    }

    // create session
    const session = await this.userAdapter.createSession(user.id);

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

    request.logger.info('session', sessionId);

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
