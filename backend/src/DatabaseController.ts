// import { CreateUser } from 'softwareproject-common';
// import { DBUser } from './models/user/db.user';
// import { MockUser, MockUserFactory } from './models/user/mock.user';
// import { UserFactory } from './models/user/user.factory';
// import { UserInterface } from './models/user/user.interface';

// export interface DatabaseControllerInterface {
//   user: UserFactory<UserInterface>
// }

// export class MockDB {
//   private _users: MockUser[] = [];

//   public get users(): MockUser[] {
//     return this._users;
//   }
// }

// export class DatabaseMockController implements DatabaseControllerInterface {
//   public db = new MockDB();

//   public get user(): MockUserFactory {
//     return new MockUserFactory(this);
//   }
// }

// export class DatabaseController {
//   public user: UserFactory<UserInterface>;

//   constructor({ userFactory }: { userFactory: UserFactory<UserInterface> }) {
//     this.user = userFactory;
//   }

//   static get real(): DatabaseController {
//     return new DatabaseController({ userFactory: DBUser.factory });
//   }

//   static get mock(): DatabaseMockController {
//     return new DatabaseMockController();
//   }
// }
