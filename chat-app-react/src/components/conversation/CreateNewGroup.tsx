import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/Ai';
import Search from '../search/Search';
import { AvatarOnline } from '../avatars/Avatar';
import myAxios from '../../ultils/myAxios';
import { useAppDispatch } from '../../app/hook';
import { createConversation } from '../../features/conversation/conversationSlice';
import { getUserLocalStorageItem } from '../../ultils';
import { IUser } from '../../ultils/interface';
import useDebounce from '../../hooks/useDebounce';

export interface IPropCreateNewGroup {
  isShowCreateNewGroup: boolean;
  setShowCreateNewGroup: (value: boolean) => void;
}

export interface IPropUserSearch extends IUser {
  userId?: string;
  userName?: string;
  add?: boolean;
}

export interface IPropUserAdd {
  user: IPropUserSearch;
}

export interface IPropAvatarSearch {
  user: IPropUserSearch;
  setListUserAddGroup?: Dispatch<SetStateAction<IPropUserSearch[]>>;
  setMember: (value: any) => void;
}

const CreateNewGroup: FC<IPropCreateNewGroup> = ({
  isShowCreateNewGroup,
  setShowCreateNewGroup,
}) => {
  const [showListFriend, setShowListFriend] = useState(false);
  const [listUserAddGroup, setListUserAddGroup] = useState<IPropUserSearch[]>(
    []
  );
  const [listFriend, setListFriend] = useState<IPropUserSearch[]>([]);
  const [member, setMember] = useState(listUserAddGroup.length + 1);
  const [groupName, setGroupName] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyWord] = useState('');
  const modelRef = useRef<HTMLDivElement>(null);

  const debounceValue = useDebounce(searchValue);

  const dispatch = useAppDispatch();

  const user = getUserLocalStorageItem();

  const handleShowListFriend = () => {
    setShowListFriend(true);
  };

  const handleCloseForm = () => {
    setShowCreateNewGroup(false);
  };

  const handleCreateNewGroupConversation = async () => {
    if (member < 3 || groupName === '') {
      return;
    }
    const creator = {
      userId: user?._id,
      email: user?.email,
      userName: user?.firstName + ' ' + user?.lastName,
      avatarUrl: user?.avatarUrl,
    };

    const participantsGroup = listUserAddGroup.map((user) => ({
      userId: user?._id,
      email: user?.email,
      userName: user?.firstName + ' ' + user?.lastName,
      avatarUrl: user?.avatarUrl,
    }));

    const data = {
      nameGroup: groupName,
      conversation_type: 'group',
      participants: [creator, ...participantsGroup],
    };
    const res = await myAxios.post('/conversation', data);
    if (res.status === 201) {
      dispatch(createConversation(res.data.metaData));
      setShowListFriend(false);
      setListUserAddGroup([]);
      setGroupName('');
      setMember(listUserAddGroup.length + 1);
      setShowCreateNewGroup(false);
    }
  };

  useEffect(() => {
    if (isShowCreateNewGroup) {
      const clickOutSide = (e: MouseEvent) => {
        if (modelRef.current && !modelRef.current?.contains(e.target as Node)) {
          handleCloseForm();
        }
      };

      document.addEventListener('mousedown', clickOutSide);

      return () => {
        document.removeEventListener('mousedown', clickOutSide);
      };
    }
  }, [isShowCreateNewGroup]);

  const getAllUser = async () => {
    const res = await myAxios.get('/user');
    if (res.data.status === 200) {
      setListFriend(res.data.metaData);
    }
  };

  useEffect(() => {
    if (keyword === searchValue.trim() || searchValue.trim() === '')
      setIsLoading(false);
    else setIsLoading(true);
  }, [searchValue]);

  useEffect(() => {
    getAllUser();
  }, []);

  useEffect(() => {
    const handleSearch = async () => {
      const res = await myAxios.get(`/user/search?q=${searchValue.trim()}`);
      console.log(res);
      if (res.status === 200) {
        setListFriend(res.data.metaData.users);
        setKeyWord(res.data.metaData.keyword);
      }
    };

    if (searchValue.trim() !== '' && keyword !== searchValue.trim()) {
      handleSearch();
      setIsLoading(false);
    }
  }, [debounceValue]);

  return (
    <div
      className={`fixed top-0 left-0 bottom-0 right-0 ${
        isShowCreateNewGroup ? 'flex' : 'hidden'
      } items-center justify-center w-screen h-screen bg-blackOverlay z-[1000]`}
    >
      <div
        className={`grid grid-cols-5 animate__animated animate__fadeInDown ${
          showListFriend
            ? 'sm:w-[80%] lg:w-[70%]'
            : 'sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%]'
        } h-[90%] bg-white rounded-lg overflow-hidden`}
        ref={modelRef}
      >
        <div
          className={`${
            showListFriend ? 'col-span-3' : 'col-span-5'
          } relative px-10 py-6`}
        >
          <h1 className='text-xl pb-2 border-b border-slate-500'>
            Create new Group
          </h1>
          <div className='mt-4'>
            <input
              name='name'
              className={`w-full px-4 py-3 bg-[#f1f1f1] rounded-lg outline-none`}
              type='text'
              placeholder='Name Group'
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
          <div className='flex gap-2 items-center mt-8'>
            <button
              onClick={handleShowListFriend}
              className='flex items-center justify-center p-2 bg-white rounded-full overflow-hidden'
            >
              <AiOutlinePlus />
            </button>
            <span>Add member</span>
          </div>
          <div className='max-h-[calc(70%-4rem)] mt-6 overflow-y-scroll'>
            {listUserAddGroup.map((user) => (
              <div key={user._id} className='mt-4'>
                <AvatarUserAdd user={user} />
              </div>
            ))}
          </div>
          <div
            className={`absolute flex items-end justify-between w-full left-0 px-6 bottom-6`}
          >
            <div className='text-black font-light'>{`Member ${member}/3`}</div>
            <div className='flex gap-3'>
              <button
                className='px-4 py-1 rounded-lg border'
                onClick={handleCloseForm}
              >
                Close
              </button>
              <button
                onClick={handleCreateNewGroupConversation}
                className={`px-4 py-1 rounded-lg bg-blue-500 text-white ${
                  member < 3 || groupName === ''
                    ? 'opacity-60 cursor-not-allowed'
                    : 'cursor-pointer'
                }`}
              >
                Done
              </button>
            </div>
          </div>
        </div>
        <div
          className={`${
            showListFriend ? 'col-span-2' : 'hidden'
          } px-4 xl:px-6 bg-[#f2f3f4] py-6`}
        >
          <Search
            className={'w-full bg-white'}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            isLoading={isLoading}
          />
          <hr className='my-4' />
          <div className='max-h-create-conversation scrollbar-hide overflow-y-scroll'>
            {listFriend.map((friend, idx) => (
              <div key={idx}>
                <AvatarSearch
                  user={friend}
                  setListUserAddGroup={setListUserAddGroup}
                  setMember={setMember}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AvatarUserAdd: FC<IPropUserAdd> = ({ user }) => {
  return (
    <div className='flex gap-2 items-center '>
      <AvatarOnline
        className={'w-10 h-10'}
        avatarUrl={user.avatarUrl}
        status={'online'}
      />
      <h1 className=''>{user.firstName + ' ' + user.lastName}</h1>
    </div>
  );
};

export const AvatarSearch: FC<IPropAvatarSearch> = ({
  user,
  setListUserAddGroup,
  setMember,
}) => {
  const [add, setAdd] = useState(user?.add ? true : false);
  const handleAddUser = (data: IPropUserSearch) => {
    if (setListUserAddGroup) {
      if (!add) {
        setListUserAddGroup((prev) => [...prev, data]);
        setMember((prev: number) => prev + 1);
      } else {
        setListUserAddGroup((prev) =>
          prev.filter((pre) => pre._id !== user._id)
        );
        setMember((prev: number) => prev - 1);
      }
      setAdd(!add);
      user.add = add;
    }
  };

  return (
    <div className='flex items-center justify-between mt-4 cursor-pointer'>
      <div className='flex gap-2 items-center '>
        <AvatarOnline
          className={'w-10 h-10'}
          avatarUrl={user.avatarUrl}
          status={'online'}
        />
        <h1 className='text-sm md:text-base'>
          {user.firstName + ' ' + user.lastName}
        </h1>
      </div>

      <div
        className={`hidden md:flex px-3 mr-2 py-1 rounded-md bg-white ${
          add ? 'text-blue-500 ' : 'text-black'
        }`}
      >
        <button
          onClick={() => handleAddUser(user)}
          className={`text-[12px] lg:text-sm `}
        >
          {add ? 'Remove' : 'Add'}
        </button>
      </div>
      <div
        className={`flex md:hidden px-2 md:px-3 mr-2 py-1 rounded-md ${
          add ? 'bg-blue-500 text-white' : 'bg-white '
        }`}
      >
        <button
          onClick={() => handleAddUser(user)}
          className='text-[12px] md:text-sm'
        >
          {add ? <AiOutlineClose /> : <AiOutlinePlus />}
        </button>
      </div>
    </div>
  );
};

export default CreateNewGroup;
