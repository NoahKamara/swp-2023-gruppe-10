import { AxiosError, AxiosResponse } from 'axios';

export const handleErrorResponse = (err: unknown, handler: (response: AxiosResponse) => unknown): unknown => {
  if (err instanceof AxiosError && err.response) {
    return handler(err.response);
  } else {
    return err;
  }
};
