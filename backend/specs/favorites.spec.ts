import { SuperAgentTest } from 'supertest';
import { authorize} from './helpers/user-helper';
import { APIResponse } from '../src/models/response';
import { matcher } from './helpers/responseMatching';
import app from '../src/app';

describe('favorite',() => {
    let agent!: SuperAgentTest;
  
    // Create User
    beforeEach(async () => {
      agent = await authorize(app);
    });

    it('make or delete Favorite', async () => {
        const path = '/api/events/1/favorite';
        await agent
        .get(path)
        .expect(matcher(APIResponse.success()));
        });

    it('failed to crate/delete favorite', async () => {
        const path = '/api/events//favorite';
        await agent
        .get(path)
        .expect(matcher(APIResponse.badRequest('Missing "ID" in path')));
    });

    it('isFavorite', async () => {
    const path = '/api/event/2/isFavorite';
    await agent
    .get(path)
    .expect(res => {
        expect(res.status).toBe(200);
        });
    });
});