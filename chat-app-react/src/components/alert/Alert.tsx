import { FC } from 'react';

export interface IProp {
  msg: string;
}

export const ErrorAlert: FC<IProp> = ({ msg }) => {
  return (
    <div
      className='fixed bottom-5 right-5 z-[1001] flex gap-2 items-center px-4 py-3 mb-4 text-sm text-red-800 rounded-lg bg-red-100 '
      role='alert'
    >
      <span className='font-medium text-white px-2 py-1 rounded bg-red-500'>
        Error!
      </span>
      <span>{msg}</span>
    </div>
  );
};

export const NotifyAlert: FC<IProp> = ({ msg }) => {
  return (
    <div
      className='fixed bottom-5 right-5 z-[1001] flex gap-2 items-center px-4 py-3 mb-4 text-sm text-blue-800 rounded-lg bg-blue-100 '
      role='alert'
    >
      <span className='font-medium text-white px-2 py-1 rounded bg-blue-500'>
        Notify!
      </span>
      <span>{msg}</span>
    </div>
  );
};