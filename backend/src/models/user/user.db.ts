import { CreationOptional } from 'sequelize';
import { Table, Column, Model, HasMany } from 'sequelize-typescript';
import { CreateUser, PublicUser, User } from 'softwareproject-common';
import { DBTicket } from '../db.ticket';
import { Response } from 'express';
import { DBSession } from '../session/session.db';
import uid from 'uid-safe';
import { UserFactory } from './user.factory';
import { UserInterface } from './user';


@Table({ modelName: 'users', timestamps: false })
export class DBUser extends Model<User, CreateUser> implements UserInterface {

  /**
  * The Factory DBUser
  *
  * @static
  * @type {UserFactory}
  */
  static get factory(): UserFactory<DBUser> {
    return {
      insert: DBUser.insert,
      byID: DBUser.byID,
      byEmail: DBUser.byEmail
    };
  }
  declare id: CreationOptional<number>;

  @Column
  email!: string;

  @Column
  password!: string;

  @Column
  firstName!: string;

  @Column
  lastName!: string;

  @Column
  street!: string;

  @Column
  number!: string;

  @Column
  city!: string;

  @Column
  zipcode!: string;

  @HasMany(() => DBTicket)
  tickets!: DBTicket[];

  /**
  * Implementation of UserFactory.insert for DBUSer
  * @see UserFactory.byID
  */
  static async insert(data: CreateUser): Promise<DBUser> {
    return await DBUser.create(data);
  }

  /**
  * Implementation of UserFactory.byID for DBUSer
  * @see UserFactory.byID
  */
  static async byID(id: number): Promise<DBUser> {
    const user = await DBUser.findByPk(id);
    if (!user) {
      throw Error('No User Found');
    }
    return user;
  }

  /**
  * Implementation of UserFactory.byEmail for DBUSer
  * @see UserFactory.byID
  */
  static async byEmail(email: string): Promise<DBUser> {
    const user = await DBUser.findOne({
      where: {
        email: email
      }
    });

    if (!user) {
      throw Error('No User Found');
    }

    return user;
  }


  /**
  * Updates a users name in the database
  *
  * @memberof DBUser
  * @instance
  * @method
  * @param {string} firstName
  * @param {string} lastName
  * @return {Promise<void>}
  */
  public async updateName({ firstName, lastName }: { firstName: string; lastName: string; }): Promise<void> {
    this.firstName = firstName;
    this.lastName = lastName;
    await this.save();
  }

  /**
  * Updates a users address in the database
  *
  * @memberof DBUser
  * @instance
  * @method
  * @param {string} street
  * @param {string} number
  * @param {string} city
  * @param {string} zipcode
  * @return {Promise<void>}
  */
  public async updateAddress({ street, number, city, zipcode }: { street: string; number: string; city: string; zipcode: string; }): Promise<void> {
    this.street = street;
    this.number = number;
    this.city = city;
    this.zipcode = zipcode;
    await this.save();
  }

  /**
  * Updates a users password in the database
  *
  * @memberof DBUser
  * @instance
  * @method
  * @param {string} old
  * @param {string} new
  * @return {Promise<void>}
  */
  public async updatePassword(password: string): Promise<void> {
    this.password = password;
    await this.save();
  }

  /**
  * Creates a new session for this user
  *
  * @memberof DBUser
  * @instance
  * @method
  * @return {Promise<DBSession>}
  */
  public async createSession(): Promise<DBSession> {
    if (!this.id) {
      throw Error('user must be saved to database before session can be created');
    }

    const session = await DBSession.create({
      user_id: this.id,
      session_id: uid.sync(24)
    });

    return session;
  }

  /**
  * Creates Tickets for an event for this user
  *
  * @memberof DBUser
  * @instance
  * @method
  * @param {number} event
  * @return {Promise<DBSession>}
  */
  public async addTicket({ event, amount }: { event: number; amount: number; }): Promise<DBTicket> {
    if (!this.id) {
      throw Error('user must be saved to database before session can be created');
    }

    const ticket = await DBTicket.create({
      user_id: this.id,
      event_id: event,
      amount: amount
    });

    return ticket;
  }

  /**
  * Returns an object suitable for using as a public user
  *
  * @memberof DBUser
  * @instance
  * @type {PublicUser}
  */
  public get public(): PublicUser {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      street: this.street,
      number: this.number,
      city: this.city,
      zipcode: this.zipcode
    };
  }
}


