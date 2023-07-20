import { FC, useRef } from 'react';
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/Ai';

export interface IPropSearchBox {
  searchValue: string;
  setSearchValue: (value: string) => void;
  setSearchData: any;
}

const SearchBox: FC<IPropSearchBox> = ({
  searchValue,
  setSearchValue,
  setSearchData,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChangeSearchValue = (e: any) => {
    setSearchValue(e.target.value);
  };

  const handleClearSearchValue = () => {
    setSearchValue('');
    setSearchData([]);
    inputRef?.current?.focus();
  };

  return (
    <div className='flex items-center gap-2 px-3 py-1 bg-gray-100 border rounded-lg'>
      <input
        type='text'
        name=''
        id=''
        className='w-full bg-transparent border-none outline-none text-sm'
        value={searchValue}
        onChange={(e) => handleChangeSearchValue(e)}
        placeholder='Enter nickname...'
        ref={inputRef}
      />
      {searchValue !== '' && (
        <span
          onClick={handleClearSearchValue}
          className='text-xs cursor-pointer'
        >
          <AiOutlineClose />
        </span>
      )}
      <span className='cursor-pointer'>
        <AiOutlineSearch />
      </span>
    </div>
  );
};

export default SearchBox;
