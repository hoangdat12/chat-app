import { Dispatch, FC, SetStateAction, useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/Ai';

export interface IPropInputDefault {
  placeHolder?: string;
  className?: string;
  value: string;
  changeValue: Dispatch<SetStateAction<string>>;
}

const InputDefault: FC<IPropInputDefault> = ({
  placeHolder,
  className,
  value,
  changeValue,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div
      className={`${className} flex items-center gap-2 text-sm border px-4 py-2 outline-none rounded-lg w-full`}
    >
      <input
        value={value}
        onChange={(e) => changeValue(e.target.value)}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeHolder ?? ''}
        className='bg-transparent w-full outline-none border-none'
      />
      <span
        onClick={() => setShowPassword(!showPassword)}
        className='cursor-pointer'
      >
        {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
      </span>
    </div>
  );
};

export default InputDefault;
