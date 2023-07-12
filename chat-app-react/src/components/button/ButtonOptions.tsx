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
  //   const optionsRef = useRef<HTMLDivElement | null>(null);

  //   useClickOutside(optionsRef, () => setShowOptions(null), 'mousedown');

  return (
    <div className='relative text-lg cursor-pointer'>
      <span onClick={() => setShowOptions(index)}>
        <FiMoreHorizontal />
      </span>
      <div
        // ref={optionsRef}
        className={`absolute top-[120%] left-[50%] -translate-x-1/2 ${
          showOptions === index ? 'flex' : 'hidden'
        } flex-col min-w-[160px] bg-white rounded shadow-default z-10`}
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
  );
};

export default ButtonOptions;
