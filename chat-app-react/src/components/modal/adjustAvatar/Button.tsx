import { FC, ButtonHTMLAttributes } from 'react';
// import './Button.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  background?: string;
}

export const Button: FC<Props> = ({
  className,
  active,
  background,
  children,
  ...props
}) => {
  return (
    <button
      className={`${className} ${
        active
          ? background
            ? background
            : 'bg-white bg-opacity-[0.03] fill-[#61dafb]'
          : ' bg-transparent fill-[#61dafb]'
      } w-8 h-8 sm:w-12 sm:h-12 rounded-full transition duration-500 flex items-center justify-center border-none outline-none cursor-pointer hover:bg-white hover:bg-opacity-[0.03] focus:bg-white focus:bg-opacity-[0.03]`}
      {...props}
    >
      {children}
    </button>
  );
};
