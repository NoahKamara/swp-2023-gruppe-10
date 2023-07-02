// /**
//  *  Hier definieren wir verschiedene Unittests.
//  *  Jeder Unittest muss in dem "specs" Ordner liegen und mit ".spec.ts" enden.
//  *  Weitere Information im "Unit Testing" Video in Sprint 4.
//  */

// import request, { SuperAgentTest } from 'supertest';
// import app from '../src/app';
// import { CreateUser, UserCredentials } from 'softwareproject-common';
// import { genMail, createUser, authorize, genPassword, getInfo, unauthorizedBody } from './helpers/user-helper';
// import { UpdatePassword, UserAddress, UserName } from 'softwareproject-common/dist/user';


// describe('Registration', () => {
//   const path = '/api/user';
//   const baseUser = {
//     password: '12345678',
//     firstName: 'Max',
//     lastName: 'Mustermann',
//     street: 'Musterweg',
//     number: '12',
//     city: 'Musterstadt',
//     zipcode: '12345'
//   };

//   it('succeeds', () => {
//     const user = {
//       ...baseUser,
//       email: genMail()
//     };

//     return request(app)
//       .post(path)
//       .send(user)
//       .then(res => {
//         expect(res.status).toBe(200);
//         console.log(res.body);
//       });
//   });


//   it('fails - duplicate email', async () => {
//     const user = {
//       ...baseUser,
//       email: genMail()
//     };

//     await request(app)
//       .post(path)
//       .send(user)
//       .expect(200, {
//         code: 200,
//         message: 'Registrierung erfolgreich',
//       });

//     return await request(app)
//       .post(path)
//       .send(user)
//       .expect(400, {
//         code: 400,
//         message: 'Nutzer mit Email existiert bereits',
//       });
//   });

//   it('fails - invalid email', () => {
//     const user = {
//       ...baseUser,
//       email: 'notamail'
//     };

//     return request(app)
//       .post(path)
//       .send(user)
//       .expect(400);
//   });

//   it('fails - short password', () => {
//     const user = {
//       ...baseUser,
//       email: genMail(),
//       password: '1234567',
//     };

//     return request(app)
//       .post(path)
//       .send(user)
//       .expect(400)
//       .expect({
//         errors: {
//           formErrors: [],
//           fieldErrors: {
//             password: ['String must contain at least 8 character(s)'],
//           },
//         },
//       });
//   });
// });

// describe('Login', async () => {
//   const path = '/api/session';
//   let credentials!: UserCredentials;

//   // Create User
//   beforeEach(async () => {
//     credentials = await createUser(app);
//   });

//   it('succeeds', () => {
//     return request(app)
//       .post(path)
//       .send(credentials)
//       .expect(200)
//       .expect({
//         code: 200,
//         message: 'Anmeldung erfolgreich',
//       });
//   });

//   it('fails - wrong password', () => {
//     return request(app)
//       .post(path)
//       .send({
//         ...credentials,
//         password: 'wrongpassword'
//       })
//       .expect(401)
//       .expect({
//         code: 401,
//         message: 'Falsches Passwort oder Unbekannter Nutzer',
//       });
//   });

//   it('fails - unknown user', () => {
//     return request(app)
//       .post(path)
//       .send({
//         ...credentials,
//         email: 'unknown@user.de'
//       })
//       .expect(401)
//       .expect({
//         code: 401,
//         message: 'Falsches Passwort oder Unbekannter Nutzer',
//       });
//   });
// });

// describe('Logout', () => {
//   const path = '/api/session';

//   let credentials!: UserCredentials;

//   // Create User
//   beforeEach(async () => {
//     credentials = await createUser(app);
//   });

//   // Helper function for determining login status
//   const isAuthorized = (agent: request.SuperAgentTest): request.Test => {
//     return agent
//       .get('/api/auth')
//       .send();
//   };

//   it('succeeds', async () => {
//     const agent = request.agent(app);

//     // Login
//     await agent
//       .post(path)
//       .send(credentials)
//       .expect(200);

//     // Logout
//     await agent
//       .delete(path)
//       .expect(200, {
//         code: 200,
//         message: 'Abmeldung erfolgreich',
//       });

//     // console.log(res.body);
//     await isAuthorized(agent).expect('false');
//   });


//   it('fails - no session id in cookie header', async () => {
//     await request(app)
//       .delete(path)
//       .expect(400, {
//         code: 400,
//         message: 'Nutzer ist nicht authentifiziert',
//       });
//   });
// });


// describe('Get Auth', () => {
//   const path = '/api/auth/';
//   it('succeeds - true', async () => {
//     (await authorize(app))
//       .get(path)
//       .expect(200, 'true');
//   });

//   it('succeeds - false', async () => {
//     await request(app)
//       .get(path)
//       .expect(200, 'false');
//   });
// });

// describe('Get User', () => {
//   const path = '/api/user';

//   it('succeeds', async () => {
//     const creds = await createUser(app);

//     (await authorize(app, creds))
//       .get(path)
//       .expect(res => {
//         expect(res.body.firstName).toBe('Max');
//         expect(res.body.lastName).toBe('Mustermann');
//         expect(res.body.street).toBe('Musterweg');
//         expect(res.body.number).toBe('12');
//         expect(res.body.city).toBe('Musterstadt');
//         expect(res.body.email).toBe(creds.email);
//         expect(res.body.id).toBeDefined();
//       })
//       .then(res => {
//         console.log(res.body);
//       });
//   });

//   it('fails - not authorized', async () => {
//     await request(app)
//       .get(path)
//       .expect(401, unauthorizedBody);
//   });
// });


// describe('Update Name', () => {
//   const path = '/api/user/name';
//   let agent!: SuperAgentTest;

//   const updateData: UserName = {
//     firstName: genPassword(),
//     lastName: genPassword()
//   };

//   // Create User
//   beforeEach(async () => {
//     agent = await authorize(app);
//   });

//   it('succeeds', async () => {
//     await agent
//       .patch(path)
//       .send(updateData)
//       .expect(200, {
//         code: 200,
//         message: 'Name wurde aktualisiert',
//       });

//     const info = await getInfo(agent);

//     expect(info.firstName).toBe(updateData.firstName);
//     expect(info.lastName).toBe(updateData.lastName);
//   });

//   it('fails - unauthorized', async () => {
//     await request(app)
//       .patch(path)
//       .send(updateData)
//       .expect(401, unauthorizedBody);
//   });
// });


// describe('Update Password', () => {
//   const path = '/api/user/password';
//   let agent!: SuperAgentTest;

//   let credentials!: UserCredentials;

//   let updateData!: UpdatePassword;

//   // Create User
//   beforeEach(async () => {
//     credentials = await createUser(app);
//     updateData = {
//       oldPassword: credentials.password,
//       newPassword: genPassword()
//     };

//     agent = await authorize(app, credentials);
//   });

//   it('succeeds', async () => {
//     await agent
//       .patch(path)
//       .send(updateData)
//       .expect(200, {
//         code: 200,
//         message: 'Passwort wurde aktualisiert',
//       });

//     await authorize(app, { email: credentials.email, password: updateData.newPassword });
//   });

//   it('fails - unauthorized', async () => {
//     await request(app)
//       .patch(path)
//       .send(updateData)
//       .expect(401, unauthorizedBody);
//   });

//   it('fails - wrong password', async () => {
//     await agent
//       .patch(path)
//       .send({ oldPassword: 'wrong', newPassword: updateData.newPassword })
//       .expect(401, { code: 401, message: 'Passwort inkorrekt' });
//   });

//   it('fails - new password too short', async () => {
//     await agent
//       .patch(path)
//       .send({ oldPassword: updateData.oldPassword, newPassword: 'short' })
//       .expect(400);
//   });
// });


// describe('Update Address', () => {
//   const path = '/api/user/address';
//   let agent!: SuperAgentTest;

//   let credentials!: UserCredentials;

//   let updateData!: UserAddress;

//   // Create User
//   beforeEach(async () => {
//     credentials = await createUser(app);
//     updateData = {
//       street: 'Straße Update',
//       number: '1234',
//       city: 'Konstanz',
//       zipcode: '54321'
//     };

//     agent = await authorize(app, credentials);
//   });

//   it('succeeds', async () => {
//     await agent
//       .patch(path)
//       .send(updateData)
//       .expect(200, {
//         code: 200,
//         message: 'Addresse wurde aktualisiert',
//       });

//     const info = await getInfo(agent);

//     expect(info.street).toBe(updateData.street);
//     expect(info.number).toBe(updateData.number);
//     expect(info.city).toBe(updateData.city);
//     expect(info.zipcode).toBe(updateData.zipcode);
//   });

//   it('fails - unauthorized', async () => {
//     await request(app)
//       .patch(path)
//       .send(updateData)
//       .expect(401, unauthorizedBody);
//   });
// });
