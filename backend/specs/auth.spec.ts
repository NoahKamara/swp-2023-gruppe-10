/* eslint-disable jasmine/no-spec-dupes */
/**
 *  Hier definieren wir verschiedene Unittests.
 *  Jeder Unittest muss in dem "specs" Ordner liegen und mit ".spec.ts" enden.
 *  Weitere Information im "Unit Testing" Video in Sprint 4.
 */

import request, { SuperAgentTest } from 'supertest';
import app, { authCtrl } from '../src/app';
import { UserCredentials } from 'softwareproject-common';
import { genMail, createUser, authorize, genPassword, getInfo } from './helpers/user-helper';
import { UpdatePassword, UserAddress, UserName } from 'softwareproject-common/dist/user';
import { APIResponse } from '../src/models/response';
import { matcher } from './helpers/responseMatching';
import { DBController } from '../src/database/DBController';
import { MockDBController } from '../src/database/mock-controller';

describe('Registration', () => {
  const baseUser = {
    password: '12345678',
    firstName: 'Max',
    lastName: 'Mustermann',
    street: 'Musterweg',
    number: '12',
    city: 'Musterstadt',
    zipcode: '12345'
  };

  let db: MockDBController;

  beforeEach(() => {
    db = new MockDBController();
    authCtrl.db = db;
  });

  afterEach(async () => {
    // Reset Controller to default
    authCtrl.db = DBController.default;
  });

  const path = '/api/user';


  it('succeeds', () => {
    const user = {
      ...baseUser,
      email: 'test@test.de'
    };

    return request(app)
      .post(path)
      .send(user)
      .then(res => {
        console.log(db.db.users);

        expect(res.status).toBe(200);
        expect(db.db.users.length).toBe(1);
        expect(db.db.users[0].firstName).toBe(baseUser.firstName);
        expect(db.db.users[0].lastName).toBe(baseUser.lastName);
        expect(db.db.users[0].street).toBe(baseUser.street);
        expect(db.db.users[0].number).toBe(baseUser.number);
        expect(db.db.users[0].city).toBe(baseUser.city);
        expect(db.db.users[0].zipcode).toBe(baseUser.zipcode);
      });
  });


  it('fails - duplicate email', async () => {
    const user = {
      ...baseUser,
      email: 'test@test.de'
    };

    db.users.insert(user);

    return await request(app)
      .post(path)
      .send(user)
      .expect(matcher(APIResponse.badRequest('Nutzer mit Email existiert bereits')));
  });

  it('fails - invalid email', () => {
    const user = {
      ...baseUser,
      email: 'notamail'
    };

    return request(app)
      .post(path)
      .send(user)
      .expect(400);
  });

  it('fails - short password', () => {
    const user = {
      ...baseUser,
      email: genMail(),
      password: '1234567',
    };

    return request(app)
      .post(path)
      .send(user)
      .expect(400);
  });
});

describe('Login', async () => {
  const path = '/api/session';
  let credentials!: UserCredentials;

  // Create User
  beforeEach(async () => {
    credentials = await createUser(app);
  });

  it('succeeds', () => {
    return request(app)
      .post(path)
      .send(credentials)
      .expect(200)
      .expect(matcher(APIResponse.success()));
  });

  it('fails - wrong password', () => {
    return request(app)
      .post(path)
      .send({
        ...credentials,
        password: 'wrongpassword'
      })
      .expect(matcher(APIResponse.unauthorized('Falsches Passwort oder Unbekannter Nutzer')));
  });

  it('fails - unknown user', () => {
    return request(app)
      .post(path)
      .send({
        ...credentials,
        email: 'unknown@user.de'
      })
      .expect(matcher(APIResponse.unauthorized('Falsches Passwort oder Unbekannter Nutzer')));
  });
});

describe('Logout', () => {
  const path = '/api/session';

  let credentials!: UserCredentials;

  // Create User
  beforeEach(async () => {
    credentials = await createUser(app);
  });

  // Helper function for determining login status
  const isAuthorized = (agent: request.SuperAgentTest): request.Test => {
    return agent
      .get('/api/auth')
      .send();
  };

  it('succeeds', async () => {
    const agent = request.agent(app);

    // Login
    await agent
      .post(path)
      .send(credentials)
      .expect(200);

    // Logout
    await agent
      .delete(path)
      .expect(matcher(APIResponse.success()));

    await isAuthorized(agent).expect(matcher(APIResponse.unauthorized()));
  });


  it('fails - no session id in cookie header', async () => {
    await request(app)
      .delete(path)
      .expect(matcher(APIResponse.unauthorized()));
  });
});


describe('Get Auth', () => {
  const path = '/api/auth/';
  it('succeeds - true', async () => {
    await (await authorize(app))
      .get(path)
      .expect(200);
  });

  it('succeeds - false', async () => {
    await request(app)
      .get(path)
      .expect(matcher(APIResponse.unauthorized()));
  });
});

describe('Get User', () => {
  const path = '/api/user';

  it('succeeds', async () => {
    const creds = await createUser(app);
    const agent = await authorize(app, creds);

    const exectedData = {
      firstName: 'Max',
      lastName: 'Mustermann',
      street: 'Musterweg',
      number: '12',
      city: 'Musterstadt',
      zipcode: '12345',
      email: creds.email
    };

    await agent
      .get(path)
      .expect(res => {
        matcher(APIResponse.success(jasmine.objectContaining(exectedData)))(res);

        expect(res.body.id).toBeDefined();
      });
  });

  it('fails - not authorized', async () => {
    await request(app)
      .get(path)
      .expect(matcher(APIResponse.unauthorized()));
  });
});


describe('Update Name', () => {
  const path = '/api/user/name';
  let agent!: SuperAgentTest;

  const updateData: UserName = {
    firstName: genPassword(),
    lastName: genPassword()
  };

  // Create User
  beforeEach(async () => {
    // erstellt eine app, die bereits auth hat,
    // also user registriert und session id ist schon als cookie gespeichert
    agent = await authorize(app);
  });

  it('succeeds', async () => {
    // call an `path` mit `updateData`
    // also user registriert und session id ist schon als cookie gespeichert

    await agent
      .patch(path)
      .send(updateData)
      .expect(matcher(APIResponse.success()));

    const info = await getInfo(agent);

    expect(info.firstName).toBe(updateData.firstName);
    expect(info.lastName).toBe(updateData.lastName);
  });

  it('fails - unauthorized', async () => {
    await request(app)
      .patch(path)
      .send(updateData)
      .expect(matcher(APIResponse.unauthorized()));
  });
});


describe('Update Password', () => {
  const path = '/api/user/password';
  let agent!: SuperAgentTest;

  let credentials!: UserCredentials;

  let updateData!: UpdatePassword;

  // Create User
  beforeEach(async () => {
    credentials = await createUser(app);
    updateData = {
      oldPassword: credentials.password,
      newPassword: genPassword()
    };

    agent = await authorize(app, credentials);
  });

  it('succeeds', async () => {
    await agent
      .patch(path)
      .send(updateData)
      .expect(matcher(APIResponse.success()));

    await authorize(app, { email: credentials.email, password: updateData.newPassword });
  });

  it('fails - unauthorized', async () => {
    await request(app)
      .patch(path)
      .send(updateData)
      .expect(matcher(APIResponse.unauthorized()));
  });

  it('fails - wrong password', async () => {
    await agent
      .patch(path)
      .send({ oldPassword: 'wrong', newPassword: updateData.newPassword })
      .expect(matcher(APIResponse.unauthorized('Passwort inkorrekt')));
  });

  it('fails - new password too short', async () => {
    await agent
      .patch(path)
      .send({ oldPassword: updateData.oldPassword, newPassword: 'short' })
      .expect(400);
  });
});


describe('Update Address', () => {
  const path = '/api/user/address';
  let agent!: SuperAgentTest;

  let credentials!: UserCredentials;

  let updateData!: UserAddress;

  // Create User
  beforeEach(async () => {
    credentials = await createUser(app);
    updateData = {
      street: 'Straße Update',
      number: '1234',
      city: 'Konstanz',
      zipcode: '54321'
    };

    agent = await authorize(app, credentials);
  });

  it('succeeds', async () => {
    await agent
      .patch(path)
      .send(updateData)
      .expect(matcher(APIResponse.success()));

    const info = await getInfo(agent);

    expect(info.street).toBe(updateData.street);
    expect(info.number).toBe(updateData.number);
    expect(info.city).toBe(updateData.city);
    expect(info.zipcode).toBe(updateData.zipcode);
  });

  it('fails - unauthorized', async () => {
    await request(app)
      .patch(path)
      .send(updateData)
      .expect(matcher(APIResponse.unauthorized()));
  });
});
