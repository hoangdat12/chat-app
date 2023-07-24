import { FC, useRef } from 'react';
import Button from '../button/Button';
import useClickOutside from '../../hooks/useClickOutside';

export interface IPropOption {
  position: string;
  width?: number;
  background?: string;
  handleDelete: any; // Function
  handleUpdate: any; // Function
  setShowOption: (value: boolean) => void;
}

const OptionDeleteAndUpdate: FC<IPropOption> = ({
  position,
  width,
  background,
  handleDelete,
  handleUpdate,
  setShowOption,
}) => {
  const optionRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(optionRef, () => setShowOption(false), 'mousedown');

  return (
    <div
      ref={optionRef}
      className={`absolute ${position} w-${width ?? 20} bg-${
        background ?? 'white'
      } shadow-default rounded`}
    >
      <Button
        text={'Edit'}
        border={'border-none'}
        className={'w-full duration-300 rounded-br-none rounded-bl-none'}
        hover={'hover:bg-gray-100'}
        fontSize={'text-sm'}
        onClick={handleUpdate}
      />
      <Button
        text={'Delete'}
        border={'border-none'}
        className={'w-full duration-300 rounded-tr-none rounded-tl-none'}
        hover={'hover:bg-gray-100'}
        fontSize={'text-sm'}
        onClick={handleDelete}
      />
    </div>
  );
};

export default OptionDeleteAndUpdate;
