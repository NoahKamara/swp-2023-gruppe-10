/* eslint-disable jasmine/no-spec-dupes */
/**
 *  Hier definieren wir verschiedene Unittests.
 *  Jeder Unittest muss in dem "specs" Ordner liegen und mit ".spec.ts" enden.
 *  Weitere Information im "Unit Testing" Video in Sprint 4.
 */

import { SuperAgentTest } from 'supertest';
import app from '../src/app';
import { authorize } from './helpers/user-helper';

describe('List', () => {
  const path = '/api/events';
  let agent!: SuperAgentTest;

  // Create User
  beforeEach(async () => {
    agent = await authorize(app);
  });

  it('lists all events', async () => {
    await agent
      .get(path)
      .expect(res => {
        expect(res.status).toEqual(200);
        expect(res.body).toBeDefined();
        expect(res.body.length).toBeGreaterThan(0);
      });
  });

  it('lists all matching "Schlagernacht"', async () => {
    await agent
      .get(path+'?term=Schlagernacht')
      .expect(res => {
        expect(res.status).toEqual(200);
        expect(res.body).toBeDefined();
        expect(res.body.length).toBeGreaterThan(0);
      });
  });
});


describe('Details', () => {
  const path = '/api/events/1';
  let agent!: SuperAgentTest;

  // Create User
  beforeEach(async () => {
    agent = await authorize(app);
  });

  const expectedData = {
    id: 1,
    title: 'Ausstellung: Frühlingsträume',
    start_date: '2023-03-03',
    end_date: '2023-08-14',
    location: 'Barockschloss',
    picture: 'ausstellung-fruehlingstraeume-2020.jpg',
    price: 6
  };

  it('succeeds', async () => {
    await agent
      .get(path)
      .expect(res => {
        expect(res.status).toEqual(200);
        expect(res.body.id).toEqual(expectedData.id);
        expect(res.body.title).toEqual(expectedData.title);
        expect(res.body.start_date).toEqual(expectedData.start_date);
        expect(res.body.end_date).toEqual(expectedData.end_date);
        expect(res.body.location).toEqual(expectedData.location);
        expect(res.body.location).toEqual(expectedData.location);
        expect(res.body.picture).toEqual(expectedData.picture);
        expect(res.body.price).toEqual(expectedData.price);
        expect(res.body.description).toBeDefined();
        expect(res.body.description_html).toBeDefined();
      });
  });
});
