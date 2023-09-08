import { FC, memo, useRef } from 'react';
import { IConversation } from '../../ultils/interface';
import Avatar from '../avatars/Avatar';
import Input from '../input/Input';
import useClickOutside from '../../hooks/useClickOutside';

export interface IChangeNickNameProp {
  conversation: IConversation | undefined;
  isShow: boolean;
  setIsShow: (value: boolean) => void;
}

const ChangeNickName: FC<IChangeNickNameProp> = memo(
  ({ conversation, isShow, setIsShow }) => {
    const modelRef = useRef<HTMLDivElement>(null);

    const handleCloseModel = () => {
      setIsShow(false);
    };

    useClickOutside(modelRef, handleCloseModel, 'mousedown');

    return (
      <div
        className={`${
          isShow ? 'flex' : 'hidden'
        } fixed top-0 left-0 bottom-0 right-0 items-center justify-center w-screen h-screen bg-blackOverlay z-[1000] px-3 sm:px-0`}
      >
        <div
          ref={modelRef}
          className={`flex flex-col animate__animated animate__fadeInDown w-full sm:w-[60%] md:w-[40%] h-4/5 sm:h-[90%] py-6 px-4 bg-white rounded-lg overflow-hidden`}
        >
          <div className='flex flex-col gap-4 h-[calc(100%-40px)] mb-2 overflow-y-scroll'>
            {conversation &&
              conversation.participants.map((participant) => {
                if (participant.enable)
                  return (
                    <div key={participant.userId} className='flex gap-4'>
                      <div>
                        <Avatar
                          avatarUrl={participant.avatarUrl}
                          className='w-10 h-10 min-h-[2.5rem] min-w-[2.5rem]'
                        />
                      </div>
                      <Input
                        defaultValue={participant.userName}
                        participant={participant}
                      />
                    </div>
                  );
              })}
          </div>
          <div className='flex items-center justify-end min-h-[40px]'>
            <div className='flex gap-3'>
              <button
                onClick={handleCloseModel}
                className='px-4 py-1 rounded-lg border'
              >
                Close
              </button>
              <button
                onClick={handleCloseModel}
                className={`px-4 py-1 rounded-lg bg-blue-500 text-white cursor-pointer`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default ChangeNickName;
