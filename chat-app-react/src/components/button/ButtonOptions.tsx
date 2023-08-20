import { FiMoreHorizontal } from 'react-icons/fi';
import Button from './Button';
import { FC } from 'react';
// import useClickOutside from '../../hooks/useClickOutside';
import { IParticipant } from '../../ultils/interface';

export interface IPropButtonOptions {
  showOptions: number | null;
  setShowOptions: (value: number | null) => void;
  handleKickUserFromGroup: (participant: IParticipant) => void;
  handlePromoted: (participant: IParticipant) => void;
  index: number;
  participant: IParticipant;
}

const ButtonOptions: FC<IPropButtonOptions> = ({
  showOptions,
  setShowOptions,
  handleKickUserFromGroup,
  handlePromoted,
  index,
  participant,
}) => {
  // const optionsRef = useRef<HTMLDivElement | null>(null);

  // useClickOutside(optionsRef, () => setShowOptions(-1), 'mousedown');

  return (
    <div className='relative text-lg cursor-pointer'>
      <span className='z-10' onClick={() => setShowOptions(index)}>
        <FiMoreHorizontal />
      </span>
      <div
        className={`absolute top-[120%] left-[50%] -translate-x-1/2 bg-white ${
          showOptions === index ? 'block' : 'hidden'
        }`}
      >
        <div
          // ref={optionsRef}
          className='flex flex-col min-w-[160px] bg-white rounded shadow-default z-[1002]'
        >
          <Button
            text={'Kick out of group'}
            fontSize={'text-sm'}
            border={'border-none'}
            hover={'hover:bg-gray-200 duration-300'}
            paddingY={'py-2'}
            onClick={() => handleKickUserFromGroup(participant)}
          />
          <Button
            text={'Promoted admin'}
            fontSize={'text-sm'}
            border={'border-none'}
            hover={'hover:bg-gray-200 duration-300'}
            paddingY={'py-2'}
            onClick={() => handlePromoted(participant)}
          />
        </div>
      </div>
    </div>
  );
};

export default ButtonOptions;
