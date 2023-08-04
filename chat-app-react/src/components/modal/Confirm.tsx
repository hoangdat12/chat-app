import { FC, memo, useRef } from 'react';
import Button from '../button/Button';
import useClickOutside from '../../hooks/useClickOutside';

export interface IPropConfirm {
  title: string;
  handleSave: () => void;
  isShow: string;
  setIsShow: (value: string) => void;
  textBtn?: string;
}

const Confirm: FC<IPropConfirm> = memo(
  ({ title, setIsShow, handleSave, textBtn }) => {
    const confirmRef = useRef<HTMLDivElement | null>(null);
    const handleClose = () => {
      setIsShow('');
    };

    useClickOutside(confirmRef, handleClose, 'mousedown');

    return (
      <div
        className={`flex fixed top-0 left-0 bottom-0 right-0 items-center justify-center w-screen h-screen bg-blackOverlay z-[1001]`}
      >
        <div
          ref={confirmRef}
          className={`flex flex-col w-3/5 sm:w-2/5 lg:w-1/4 h-1/4 py-4 animate__animated animate__fadeInDown bg-white rounded-lg overflow-hidden`}
        >
          <h1 className='text-xl sm:text-2xl h-full max-w-[80%] text-center mx-auto'>
            {title}
          </h1>
          <div className={`flex justify-end gap-2 mt-12 px-4`}>
            <Button
              text={'Close'}
              fontSize={'text-sm'}
              border={'border-none'}
              hover={'hover:bg-gray-200 duration-300'}
              paddingY={'py-2'}
              paddingX={'px-4'}
              onClick={handleClose}
            />
            <Button
              text={textBtn ?? 'Save'}
              fontSize={'text-sm'}
              border={'border-none'}
              background={'bg-blue-500'}
              color={'text-white'}
              hover={'hover:bg-blue-700 duration-300'}
              paddingY={'py-2'}
              paddingX={'px-4'}
              onClick={handleSave}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default Confirm;
