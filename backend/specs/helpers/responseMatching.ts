
import { Response } from 'supertest';
import { APIResponse } from '../../src/models/response';

export const matcher = (expected: APIResponse): (res: Response) => void => {
  return (res: Response) => {
    expect(res.status).toEqual(expected.status);
    console.log('Expect not empty body');
    if (!expected.data) {
      console.log('Expect empty body');
      expect(res.body).toEqual({});
    } else {
      console.log('Expect not empty body');
      expect(res.body).toEqual(expected.data);
    }
  };
};
