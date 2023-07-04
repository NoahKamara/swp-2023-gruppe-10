import { AxiosError, AxiosResponse } from 'axios';

export const handleErrorResponse = (err: unknown, handler: (response: AxiosResponse) => void): void => {
  if (err instanceof AxiosError && err.response) {
    handler(err.response);
  }
};
