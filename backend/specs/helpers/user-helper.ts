import uid from 'uid-safe';
import { PublicUser, UserCredentials } from 'softwareproject-common';
import request, { SuperAgentTest } from 'supertest';
import { Express } from 'express';

export const genMail = (): string => {
  return uid.sync(8) + '@test.mail';
};

export const genPassword = (): string => {
  return uid.sync(8);
};

export const createUser = async (app: Express): Promise<UserCredentials> => {
  const credentials = {
    email: genMail(),
    password: genPassword(),
  };

  const user = {
    ...credentials,
    firstName: 'Max',
    lastName: 'Mustermann',
    street: 'Musterweg',
    number: '12',
    city: 'Musterstadt',
    zipcode: '12345'
  };

  await request(app)
    .post('/api/user')
    .send(user)
    .expect(200);

  return credentials;
};

export const authorize = async (app: Express, creds: UserCredentials | null = null): Promise<request.SuperAgentTest> => {
  const agent = request.agent(app);

  let credentials!: UserCredentials;

  if (!creds) {
    credentials = await createUser(app);
  } else {
    credentials = creds;
  }

  await agent
    .post('/api/session')
    .send(credentials)
    .expect(200);

  return agent;
};


// export const getInfo = async (app: Express, credentials: UserCredentials): Promise<PublicUser> => {
//   const agent = request.agent(app);

//   await agent
//     .post('/api/session')
//     .send(credentials)
//     .expect(200);

//   const res = await agent
//     .get('/api/user')
//     .send();

//   return res.body;
// };

export const getInfo = async (agent: SuperAgentTest): Promise<PublicUser> => {
  const res = await agent
    .get('/api/user')
    .send();

  return res.body;
};


export const unauthorizedBody = { code: 401, message: 'Unauthorized' };
