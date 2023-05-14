/**
 *  Hier definieren wir verschiedene Unittests.
 *  Jeder Unittest muss in dem "specs" Ordner liegen und mit ".spec.ts" enden.
 *  Weitere Information im "Unit Testing" Video in Sprint 4.
 */

import request from 'supertest';
import app from '../src/app';
import { DisplayProcessor, SpecReporter, StacktraceOption } from 'jasmine-spec-reporter';
import SuiteInfo = jasmine.SuiteInfo
import { attachCookies } from 'superagent';

class CustomProcessor extends DisplayProcessor {
  public displayJasmineStarted(info: SuiteInfo, log: string): string {
    return `TypeScript ${log}`;
  }
}

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(
  new SpecReporter({
    spec: {
      displayStacktrace: StacktraceOption.NONE,
    },
    customProcessors: [CustomProcessor],
  })
);




describe('POST /api/user (User Registration)', () => {
  const path = '/api/user';
  const user = {
    firstName: 'Max',
    lastName: 'Mustermann',
    password: '12345678',
  };

  it('should succeed', async () => {
    return await request(app)
      .post(path)
      .send({
        ...user,
        email: 'user1@mail.de'
      });
  });


  it('should fail: duplicate email', async () => {
    const user2 = {
      ...user,
      email: 'other@mail.com'
    };


    await request(app)
      .post(path)
      .send(user2)
      .expect(200, {
        code: 200,
        message: 'Login successful',
      });

    return await request(app)
      .post(path)
      .send(user2)
      .expect(400, {
        code: 400,
        message: 'User with Email already exists',
      });
  });

  it('should fail: invalid email', () => {
    return request(app)
      .post(path)
      .send({
        ...user,
        email: 'notamail'
      })
      .expect(400, {
        errors: {
          formErrors: [],
          fieldErrors: {
            email: ['Invalid email'],
          },
        },
      });
  });

  it('should fail: short password', () => {
    return request(app)
      .post(path)
      .send({
        ...user,
        email: 'shortpassword@mail.com',
        password: '1234567',
      })
      .expect(400)
      .expect({
        errors: {
          formErrors: [],
          fieldErrors: {
            password: ['String must contain at least 8 character(s)'],
          },
        },
      });
  });
});


describe('POST /api/session (User Login)', () => {
  const path = '/api/session';

  const loginInfo = {
    email: 'login.test@uni.kn',
    password: '12345678'
  };

  // Create User
  beforeAll(async () => {
    await request(app)
      .post('/api/user')
      .send({
        ...loginInfo,
        firstName: 'Max',
        lastName: 'Mustermann',
      })
      .expect(200);
  });

  it('should succeed', () => {
    return request(app)
      .post(path)
      .send(loginInfo)
      .expect(200)
      .expect({
        code: 200,
        message: 'Login successful',
      });
  });

  it('should fail: wrong password', () => {
    return request(app)
      .post(path)
      .send({
        ...loginInfo,
        password: 'wrong'
      })
      .expect(401)
      .expect({
        code: 401,
        message: 'Wrong password',
      });
  });

  it('should fail: unknown user', () => {
    return request(app)
      .post(path)
      .send({
        ...loginInfo,
        email: 'unknown@user.de'
      })
      .expect(401)
      .expect({
        code: 401,
        message: 'E-Mail address not found',
      });
  });
});

describe('POST /api/session (User Logout)', () => {
  const path = '/api/session';

  const loginInfo = {
    email: 'user.logout@uni.kn',
    password: '12345678'
  };

  const user = {
    ...loginInfo,
    firstName: 'Max',
    lastName: 'Mustermann',
  };

  // Helper function for determining login status
  const isAuthorized = (agent: request.SuperAgentTest): request.Test => {
    return agent
      .get('/api/auth')
      .send();
  };

  // Create User
  beforeAll(async () => {
    await request(app)
      .post('/api/user')
      .send(user)
      .expect(200);
  });

  it('should succeed', async () => {
    const agent = request.agent(app);

    // Login
    await agent
      .post(path)
      .send(user)
      .expect(200);

    // Logout
    await agent
      .delete(path)
      .expect(200, {
        code: 200,
        message: 'Logout successful',
      });

    // console.log(res.body);
    await isAuthorized(agent).expect('false');
  });


  it('should fail: no session id in cookie header', async () => {
    await request(app)
      .delete(path)
      .expect(400, {
        code: 400,
        message: 'Client did not send Session ID',
      });
  });
});
