import { FC } from 'react';
import { IoSearch } from 'react-icons/io5';
import { AiOutlineClose } from 'react-icons/Ai';
import UserBox from '../box/UserBox';
import {
  getNameAndAvatarOfConversation,
  getUserLocalStorageItem,
} from '../../ultils';
import { useNavigate } from 'react-router-dom';

export interface IPopSearchBox {
  className?: string;
  width?: string;
  height?: string;
  searchValue: string;
  setSearchValue: (value: string) => void;
  isLoading?: boolean;
  isShow?: boolean;
  setIsShow?: (value: boolean) => void;
  listResult?: any[];
  showListConversationSM?: boolean;
}

const user = getUserLocalStorageItem();

const Search: FC<IPopSearchBox> = ({
  className,
  width,
  height,
  searchValue,
  setSearchValue,
  isLoading,
  isShow,
  setIsShow,
  listResult,
  showListConversationSM,
}) => {
  const navigate = useNavigate();
  const handleClearSearchValue = () => {
    setSearchValue('');
  };
  const handleClickBox = (result: any) => {
    if (setIsShow) setIsShow(false);
    setSearchValue('');
    navigate(`/conversation/${result._id}`);
  };
  return (
    <div
      className={`${className} relative ${width ? width : 'w-[400px]'} ${
        height ? height : 'h-10'
      }  bg-[#f5f7f9] rounded-xl`}
    >
      <div
        className={`flex items-center ${
          showListConversationSM !== undefined
            ? showListConversationSM
              ? ''
              : 'justify-center gap-0'
            : 'gap-2'
        } h-full w-full px-2`}
      >
        <input
          onChange={(e) => setSearchValue(e.target.value)}
          className='w-full pl-1 h-full bg-transparent border-none outline-none text-black'
          type='text'
          placeholder='Search...'
          value={searchValue}
        />
        {isLoading ? (
          <span className='flex items-center justify-center w-3 h-3 loading-spinner'></span>
        ) : (
          <span
            className={`${
              searchValue.trim() !== '' ? 'flex' : 'hidden'
            } items-center justify-center text-sm cursor-pointer`}
            onClick={handleClearSearchValue}
          >
            <AiOutlineClose />
          </span>
        )}
        <span className='flex items-center justify-center'>
          <IoSearch className='text-black text-xl' />
        </span>
      </div>

      <div
        className={`${
          !isShow && 'hidden'
        } absolute overflow-auto top-12 w-full max-h-[300px] bg-white rounded-bl-md rounded-br-md shadow-modal-header`}
      >
        {listResult &&
          listResult?.map((result) => {
            const { name, avatarUrl } = getNameAndAvatarOfConversation(
              result,
              user
            );
            return (
              <div
                onClick={() => handleClickBox(result)}
                className='flex items-center hover:bg-slate-100 px-4 h-[70px] cursor-pointer'
              >
                <UserBox avatarUrl={avatarUrl} userName={name} />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Search;
