import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { validateBody } from './validation/requestValidation';
import { createUserSchema, updatePasswordSchema, userAddressSchema, userCredentialsSchema, userNameSchema } from './validation/user';
import { APIResponse } from './models/response';
import { DBUser } from './models/db.user';
import { DBSession } from './models/db.session';


export class AuthController {
  private salt: number | string = 10;

  /**
   * Brief description of the constructor here.
   *
   * @constructor
   * @param {UserAdapter} userAdapter - Brief description of the parameter here.
   */
  constructor({
    salt,
  }: {
    salt: number | string;
  }) {
    this.salt = salt;
  }

  /**
   * Authorize a user by session cookie
   */
  async authorize(request: Request, response: Response, next: NextFunction): Promise<void> {
    response.locals.session = null;

    // get session id from cookies
    const sessionId = request.cookies.sessionId;

    if (!sessionId) {
      request.logger.warn('authorization: failure - no session id in header');
      next();
      return;
    }

    request.logger.info(`authorization: trying with id ${sessionId}`);

    try {
      response.locals.session = await DBSession.byID(sessionId);
      request.logger.info('authorization: succeeded');
    } catch (err) {
      request.logger.warn('authorization: failure - session could not be found', err);
    }

    return next();
  }

  /**
   * Create a new user
   */
  async createUser(request: Request, response: Response): Promise<void> {
    const data = validateBody(request, response, createUserSchema);

    if (!data) {
      request.logger.error('invalid user info in body');
      return;
    }


    data.password = bcrypt.hashSync(data.password, this.salt);

    try {
      await DBUser.byEmail(data.email);
      APIResponse.badRequest('Nutzer mit Email existiert bereits').send(response);
      return;
    } catch {
      request.logger.info('no user with this email. can create new one');
    }

    try {
      const user = await DBUser.create(data);

      if (!user.id) {
        APIResponse.internal('Nutzer hat keine ID').send(response);
        return;
      }

      // create session
      const session = await user.createSession();

      response.cookie('sessionId', session.sessionId, { httpOnly: true });
      APIResponse.success().send(response);
      return;
    } catch (err) {
      request.logger.error(err);
      APIResponse.internal(err).send(response);
    }
  }

  /**
   *  returns true if the user is authorized, otherwise false
   */
  async getAuth(request: Request, response: Response): Promise<void> {
    const user: DBUser = response.locals.session?.user;

    if (!user) {
      request.logger.error('endpoint requires authorization');
      APIResponse.unauthorized().send(response);
      return;
    }

    APIResponse.success().send(response);
  }

  /**
   *  returns user info if they are authorized
   */
  async getUser(request: Request, response: Response): Promise<void> {
    const user: DBUser = response.locals.session?.user;

    if (!user) {
      APIResponse.unauthorized().send(response);
      return;
    }

    APIResponse.success(user.public).send(response);
    return;
  }

  /**
   *  update user name info
   */
  async updateName(request: Request, response: Response): Promise<void> {
    const data = validateBody(request, response, userNameSchema);
    if (!data) return;

    const user: DBUser = response.locals.session?.user;
    if (!user) {
      APIResponse.unauthorized().send(response);
      return;
    }

    try {
      await user.updateName(data);
      request.logger.info('name updated');
      APIResponse.success().send(response);
    } catch (err) {
      request.logger.error(err);
      APIResponse.internal(err).send(response);
    }
  }

  /**
   *  update user address info
   */
  async updateAddress(request: Request, response: Response): Promise<void> {
    const data = validateBody(request, response, userAddressSchema);
    if (!data) return;

    const user: DBUser = response.locals.session?.user;
    if (!user) {
      APIResponse.unauthorized().send(response);
      return;
    }

    try {
      await user.updateAddress(data);
      APIResponse.success().send(response);
    } catch (err) {
      request.logger.error(err);
      APIResponse.internal(err).send(response);
    }
  }

  /**
   *  update user password info
   */
  async updatePassword(request: Request, response: Response): Promise<void> {
    const data = validateBody(request, response, updatePasswordSchema);
    if (!data) return;

    const user: DBUser = response.locals.session?.user;
    if (!user) {
      APIResponse.unauthorized().send(response);
      return;
    }

    if (!bcrypt.compareSync(data.oldPassword, user.password)) {
      request.logger.error('old password doesnt match');
      APIResponse.unauthorized('Passwort inkorrekt').send(response);
      return;
    }

    const hashedPassword = bcrypt.hashSync(data.newPassword, this.salt);

    try {
      await user.updatePassword(hashedPassword);
      APIResponse.success().send(response);
    } catch (err) {
      request.logger.error(err);
      APIResponse.internal(err).send(response);
    }
  }

  /**
   * Login an existing user
   */
  async login(request: Request, response: Response): Promise<void> {
    const body = validateBody(request, response, userCredentialsSchema);
    if (!body) return;

    let user: DBUser;
    try {
      user = await DBUser.byEmail(body.email);
    } catch {
      request.logger.info('could not lookup user by mail');
      APIResponse.unauthorized('Falsches Passwort oder Unbekannter Nutzer').send(response);
      return;
    }

    if (!bcrypt.compareSync(body.password, user.password)) {
      request.logger.info('password mismatch');
      APIResponse.unauthorized('Falsches Passwort oder Unbekannter Nutzer').send(response);
      return;
    }

    // create session
    try {
      request.logger.info('creating session');
      const session = await user.createSession();
      response.cookie('sessionId', session.sessionId, { httpOnly: true });
      APIResponse.success().send(response);
    } catch (err) {
      request.logger.error(err);
      APIResponse.internal(err).send(response);
    }

    return;
  }

  /**
   * logout a currently logged in user
   */
  async logout(request: Request, response: Response): Promise<void> {
    const session: DBUser = response.locals.session;
    if (!session) {
      APIResponse.unauthorized().send(response);
      return;
    }


    await session.destroy();

    // invalidate session cookie
    response.cookie('sessionId', null, { httpOnly: true, expires: new Date(0) });
    APIResponse.success().send(response);
  }
}
