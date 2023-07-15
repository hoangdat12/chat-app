import { FC } from 'react';

export interface IPropNotAllowed {
  isValidSendMessage: boolean;
}

const NotAllowed: FC<IPropNotAllowed> = ({ isValidSendMessage }) => {
  return (
    <div
      className={`${
        isValidSendMessage ? 'flex' : 'hidden'
      } absolute top-0 left-0 right-0 bottom-0 z-10 cursor-not-allowed`}
    ></div>
  );
};

export default NotAllowed;
