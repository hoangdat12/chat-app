import { FC, MouseEventHandler, ReactNode } from 'react';
import { Link } from 'react-router-dom';

export interface IPropButtonRounded {
  icon: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  to?: string;
}

export const ButtonRounded: FC<IPropButtonRounded> = ({
  icon,
  className,
  onClick,
  to,
}) => {
  return (
    <Link
      to={to ? to : '#'}
      className={`${className} flex items-center justify-center text-[22px] p-2 bg-[#f1f3f4] rounded-full cursor-pointer`}
      onClick={onClick ? onClick : undefined}
    >
      {icon}
    </Link>
  );
};
