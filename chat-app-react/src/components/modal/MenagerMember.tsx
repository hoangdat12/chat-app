import { FC, memo, useRef, useState } from 'react';
import { IChangeNickNameProp } from './ChangeNickName';
import useClickOutside from '../../hooks/useClickOutside';
import Avatar from '../avatars/Avatar';
import { IParticipant } from '../../ultils/interface';
import { conversationService } from '../../features/conversation/conversationService';
import { getUserLocalStorageItem } from '../../ultils';
import { useAppDispatch } from '../../app/hook';
import { handlePromotedAdmin } from '../../features/conversation/conversationSlice';
import ButtonOptions from '../button/ButtonOptions';

const user = getUserLocalStorageItem();

export interface IPropMenagerMember extends IChangeNickNameProp {
  isValidSendMessage: boolean;
}

const MenagerMember: FC<IPropMenagerMember> = memo(
  ({ conversation, isShow, setIsShow, isValidSendMessage }) => {
    const [showOptions, setShowOptions] = useState<number | null>(null);
    const modelRef = useRef<HTMLDivElement | null>(null);
    const dispatch = useAppDispatch();

    const handleCloseModel = () => {
      setIsShow(false);
    };

    useClickOutside(modelRef, handleCloseModel, 'mousedown');

    const handleKickUserFromGroup = async (participant: IParticipant) => {
      if (conversation) {
        await conversationService.handleDeleteMember({
          conversationId: conversation?._id,
          participant,
        });
        // handleCloseModel();
        setShowOptions(-1);
      }
    };

    const handlePromoted = async (participant: IParticipant) => {
      if (conversation) {
        dispatch(
          handlePromotedAdmin({
            conversationId: conversation?._id,
            participant,
          })
        );
        // handleCloseModel();
        setShowOptions(-1);
      }
    };

    return (
      <div
        className={`${
          isShow ? 'flex' : 'hidden'
        } fixed top-0 left-0 bottom-0 right-0 items-center justify-center w-screen h-screen bg-blackOverlay z-[1000]`}
      >
        <div
          ref={modelRef}
          className={`relatice flex flex-col animate__animated animate__fadeInDown w-4/5 sm:w-[60%] md:w-1/2 h-4/5 sm:h-[90%] py-6 px-4 bg-white rounded-lg overflow-hidden`}
        >
          <h1 className='text-2xl text-center'>Manager Member</h1>

          <div className='flex flex-col px-4 h-[calc(100%-72px)] mt-4 mb-2 overflow-y-scroll'>
            <div>
              <h2 className='text-lg'>Admin</h2>
              {conversation?.creators?.map((creator) => {
                if (!creator.enable) return;
                return (
                  <div
                    key={`${creator.userId} ${Math.random()}`}
                    className='flex items-center justify-start gap-4 py-[6px]'
                  >
                    <Avatar
                      avatarUrl={creator.avatarUrl}
                      className='w-10 h-10 min-h-[2.5rem] min-w-[2.5rem]'
                    />
                    <h1 className='min-w-[200px]'>{creator.userName}</h1>
                  </div>
                );
              })}
            </div>
            <div className='mt-4'>
              <h2 className='text-lg'>Member</h2>
              {conversation &&
                conversation.participants.map((participant, idx) => {
                  if (participant.userId === user?._id || !participant.enable)
                    return;
                  return (
                    <div
                      key={`${participant.userId} ${Math.random()}`}
                      className='flex items-center justify-start gap-4 py-[6px]'
                    >
                      <Avatar
                        avatarUrl={participant.avatarUrl}
                        className='w-10 h-10 min-h-[2.5rem] min-w-[2.5rem]'
                      />
                      <h1 className='min-w-[200px]'>{participant.userName}</h1>
                      {isValidSendMessage && (
                        <ButtonOptions
                          showOptions={showOptions}
                          setShowOptions={setShowOptions}
                          handleKickUserFromGroup={handleKickUserFromGroup}
                          handlePromoted={handlePromoted}
                          index={idx}
                          participant={participant}
                        />
                      )}
                    </div>
                  );
                })}
            </div>
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

export default MenagerMember;
