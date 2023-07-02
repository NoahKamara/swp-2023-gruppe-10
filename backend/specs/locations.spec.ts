/* eslint-disable jasmine/no-spec-dupes */
/**
 *  Hier definieren wir verschiedene Unittests.
 *  Jeder Unittest muss in dem "specs" Ordner liegen und mit ".spec.ts" enden.
 *  Weitere Information im "Unit Testing" Video in Sprint 4.
 */
import { SuperAgentTest } from 'supertest';
import app from '../src/app';
import { authorize } from './helpers/user-helper';
import { matcher } from './helpers/responseMatching';
import { APIResponse } from '../src/models/response';

describe('List', () => {
  const path = '/api/locations';
  let agent!: SuperAgentTest;

  // Create User
  beforeEach(async () => {
    agent = await authorize(app);
  });

  it('lists all locations', async () => {
    await agent
      .get(path)
      .expect(res => {
        expect(res.status).toEqual(200);
        expect(res.body).toBeDefined();
        expect(res.body.length).toBeGreaterThan(0);
      });
  });
});


describe('Lookup', () => {
  const path = '/api/locations/';
  let agent!: SuperAgentTest;

  // Create User
  beforeEach(async () => {
    agent = await authorize(app);
  });

  it('succeeds for Palmenhaus', async () => {
    await agent
      .get(path+'palmenhaus')
      .expect(res => {
        expect(res.status).toEqual(200);
        expect(res.body.id).toBeDefined();
        expect(res.body.name).toBeDefined();
        expect(res.body.name.toLowerCase()).toEqual('palmenhaus');
        expect(res.body.coordinates_lat).toBeDefined();
        expect(res.body.coordinates_lng).toBeDefined();
        expect(res.body.picture).toBeDefined();
        expect(res.body.description).toBeDefined();
        expect(res.body.description_html).toBeDefined();
      });
  });

  it('fails for not found loc', async () => {
    const name = 'nonexistingloc';
    await agent
      .get(path+name)
      .expect(matcher(APIResponse.notFound(`No location with name ${name}`)));
  });
});
