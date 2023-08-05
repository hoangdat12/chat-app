import { Dispatch, FC, SetStateAction } from 'react';

export interface IPropInputEmail {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  placeholder: string;
  className?: string;
}

const InputEmail: FC<IPropInputEmail> = ({
  value,
  setValue,
  placeholder,
  className,
}) => {
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      type='text'
      placeholder={placeholder}
      className={`${className} flex items-center gap-2 text-sm border mt-3 px-4 py-2 outline-none rounded-lg w-full`}
    />
  );
};

export default InputEmail;
