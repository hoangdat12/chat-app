import { FC } from "react";
import { IoSearch } from "react-icons/io5";

export interface IPopSearchBox {
  className?: string;
  width?: string;
  height?: string;
}

const Search: FC<IPopSearchBox> = ({ className, width, height }) => {
  return (
    <div
      className={`${className} flex items-center gap-2 ${
        width ? width : "w-[400px]"
      } ${height ? height : "h-10"} px-[12px] bg-[#f5f7f9] rounded-xl`}
    >
      <input
        className='w-full pl-1 h-full bg-transparent border-none outline-none text-black'
        type='text'
        placeholder='Search...'
      />
      <span className='flex items-center justify-center'>
        <IoSearch className='text-black text-xl' />
      </span>
    </div>
  );
};

export default Search;
