import { FC } from 'react';

export interface IButtonProp {
  className?: string;
  text: string;
  color?: string;
  background?: string;
  padding?: string;
  paddingX?: string;
  paddingY?: string;
  fontSize?: string;
  border?: string;
  borderColor?: string;
  hover?: string;
  onClick?: any;
  Icons?: JSX.Element;
  textSize?: string;
}

const Button: FC<IButtonProp> = ({
  text,
  background,
  color,
  padding,
  paddingX,
  paddingY,
  fontSize,
  border,
  borderColor,
  hover,
  className,
  onClick,
  Icons,
  textSize,
}) => {
  return (
    <button
      className={`
      ${className}
      ${background} 
      ${color} 
      ${padding} 
      ${paddingX ?? 'px-2'} 
      ${paddingY ?? 'py-1'} 
      ${fontSize ?? 'text-base'} 
      ${border ?? 'border'} 
      ${borderColor ?? 'border-black'} 
      ${color} 
      ${hover} 
      rounded duration-300 flex items-center justify-center gap-2`}
      onClick={onClick}
    >
      {Icons}
      <p className={textSize}>{text}</p>
    </button>
  );
};

export default Button;
