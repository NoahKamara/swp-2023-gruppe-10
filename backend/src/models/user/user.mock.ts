import { CreateUser, PublicUser, Ticket, User } from 'softwareproject-common';
import { Session } from '../session';
import { UserFactory } from './user.factory';
import { MockDBController } from '../../database/mock-controller';
import { UserInterface } from './user';
import uid from 'uid-safe';



export class MockUserFactory implements UserFactory<MockUser> {
  constructor(private controller: MockDBController) { }

  insert(data: CreateUser): Promise<MockUser> {
    console.log('[MockUser] - insert');
    const userData: User = {
      id: this.controller.db.users.length,
      ...data,
    };

    const user = new MockUser(userData, this.controller);
    this.controller.db.users.push(user);
    return Promise.resolve(user);
  }
  // public sessions: [MockUser] = [];


  byID(id: number): Promise<MockUser> {
    console.log('[MockUser] - byID');
    const user = this.controller.db.users.find(u => u.id === id);
    if (!user) {
      throw Error('Not Found');
    }

    return Promise.resolve(user);
  }

  byEmail(email: string): Promise<MockUser> {
    console.log('[MockUser] - byEmail');
    const user = this.controller.db.users.find(u => u.email === email);
    if (!user) {
      throw Error('Not Found');
    }

    return Promise.resolve(user);
  }
}

export class MockUser implements UserInterface, User {
  id: number;
  email: string;
  password: string;
  street: string;
  number: string;
  city: string;
  zipcode: string;
  firstName: string;
  lastName: string;
  controller: MockDBController;

  constructor(user: User, controller: MockDBController) {
    this.id = user.id;
    this.email = user.email;
    this.password = user.password;
    this.street = user.street;
    this.number = user.number;
    this.city = user.city;
    this.zipcode = user.zipcode;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.controller = controller;
  }

  get public(): PublicUser {
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updatePassword(password: string): Promise<void> {
    throw new Error('updatePassword not implemented.');
  }


  public users: MockUser[] = [];

  updateName({ firstName, lastName }: { firstName: string; lastName: string; }): Promise<void> {
    this.firstName = firstName;
    this.lastName = lastName;
    return Promise.resolve();
  }

  updateAddress({ street, number, city, zipcode }: { street: string; number: string; city: string; zipcode: string; }): Promise<void> {
    this.street = street;
    this.number = number;
    this.city = city;
    this.zipcode = zipcode;

    return Promise.resolve();
  }

  createSession(): Promise<Session> {
    const sess = this.controller.sessions.insert({
      user_id: this.id,
      session_id: uid.sync(24),
    });

    return Promise.resolve(sess);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addTicket({ event, amount }: { event: number; amount: number; }): Promise<Ticket> {
    throw new Error('method not impl');
  }
}
