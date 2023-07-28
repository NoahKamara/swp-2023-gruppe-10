import { SuperAgentTest } from 'supertest';
import app from '../src/app';
import { authorize, createUser, getInfo } from './helpers/user-helper';
import { matcher } from './helpers/responseMatching';
import { APIResponse } from '../src/models/response';
import { PublicUser, Review, UserCredentials } from 'softwareproject-common';
import { date } from 'zod';

describe('Post Review', () => {
    const path = '/api/locations/palmenhaus/reviews';
    let agent!: SuperAgentTest;

    
    const data = {
        stars: 4,
        title: 'titel',
        comment: 'comment'
    };


    beforeEach(async () => {
        await authorize;
      });

      it('review has been posted', async () => {
        await agent
        .post(path)
        .send(data)
        .expect(matcher(APIResponse.success()));
  
      });


});