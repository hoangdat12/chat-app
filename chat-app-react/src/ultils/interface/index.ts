import { AxiosResponse } from 'axios';

export * from './message.interface';
export * from './auth.interface';

export interface IResponse<T> extends AxiosResponse {
  data: {
    message: string;
    metaData: T;
    status: number;
  };
}
