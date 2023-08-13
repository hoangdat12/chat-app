import { AxiosResponse } from 'axios';

export * from './message.interface';
export * from './auth.interface';
export * from './friend.interface';
export * from './notify.interface';
export * from './user.interface';
export * from './post.interface';
export * from './comment.interface';
export * from './call.interface';

export interface IResponse<T> extends AxiosResponse {
  data: {
    message: string;
    metaData: T;
    status: number;
  };
}

export interface IPagination {
  limit: number;
  page: number;
  sortedBy: string | null;
}
