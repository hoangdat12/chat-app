import { HttpException, HttpStatus } from '@nestjs/common';
import { IUserCreated, Pagination } from './interface';

export const getUsername = (user: IUserCreated) => {
  return `${user?.firstName} ${user?.lastName}`;
};

export const checkNegativeNumber = (pagination: Pagination) => {
  const { page, limit } = pagination;
  if (page < 0 || limit <= 0)
    throw new HttpException('Invalid query!', HttpStatus.BAD_REQUEST);
  return pagination;
};

export const convertUserIdString = (user: any): IUserCreated => {
  try {
    return {
      _id: user._id.toString(),
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName,
      avatarUrl: user?.avatarUrl,
      password: null,
      isActive: user?.isActive,
      role: user?.role,
      loginWith: user?.loginWith,
    };
  } catch (error) {
    throw error;
  }
};
