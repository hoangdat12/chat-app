import { FC, memo, useEffect, useRef, useState } from 'react';
import Search from '../search/Search';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { selectConversation } from '../../features/conversation/conversationSlice';
import { getUserLocalStorageItem } from '../../ultils';
import { IParticipant, IUser } from '../../ultils/interface';
import useDebounce from '../../hooks/useDebounce';
import { AiOutlinePlus } from 'react-icons/Ai';
import { AvatarSearch } from '../avatars/AvatarSearch';
import { AvatarUserAdd } from '../avatars/AvatarAddUser';
import { conversationService } from '../../features/conversation/conversationService';
import {
  getFriendOfUser,
  selectFriend,
} from '../../features/friend/friendSlice';
import { IFriend } from '../../ultils/interface/friend.interface';
import { friendService } from '../../features/friend/friendService';
import Loading from '../button/Loading';
import { useNavigate, useParams } from 'react-router-dom';
import { setIsError } from '../../features/showError';

export interface IPropCreateNewGroup {
  isShowCreateNewGroup: boolean;
  setShowCreateNewGroup: (value: boolean) => void;
  type?: string;
}

export interface IPropUserSearch extends IUser {
  userId?: string;
  userName?: string;
  add?: boolean;
}

const CreateNewGroup: FC<IPropCreateNewGroup> = memo(
  ({ isShowCreateNewGroup, setShowCreateNewGroup, type }) => {
    const [showListFriend, setShowListFriend] = useState(false);
    const [listUserAddGroup, setListUserAddGroup] = useState<IParticipant[]>(
      []
    );
    const [listFriend, setListFriend] = useState<IFriend[]>([]);
    const [member, setMember] = useState(listUserAddGroup.length + 1);
    const [groupName, setGroupName] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [keyword, setKeyWord] = useState('');

    const modelRef = useRef<HTMLDivElement>(null);
    const { conversationId } = useParams();
    const navigate = useNavigate();
    const debounceValue = useDebounce(searchValue);

    const dispatch = useAppDispatch();
    const { friends, isLoading: loadingFriend } = useAppSelector(selectFriend);
    const { conversations, isLoading: loadingConversation } =
      useAppSelector(selectConversation);

    const user = getUserLocalStorageItem();

    // Click show list friend
    const handleShowListFriend = () => {
      setShowListFriend(true);
      if (friends === null) {
        dispatch(getFriendOfUser(user._id));
      }
    };

    // Click close form create
    const handleCloseForm = () => {
      setListUserAddGroup([]);
      setGroupName('');
      setSearchValue('');
      setShowCreateNewGroup(false);
    };

    // Call api create new group
    const handleCreateNewGroupConversation = async () => {
      if (member < 2 || groupName === '') {
        return;
      }
      const creator = {
        userId: user?._id,
        email: user?.email,
        userName: user?.firstName + ' ' + user?.lastName,
        avatarUrl: user?.avatarUrl,
        enable: true,
        isReadLastMessage: true,
        peerId: user?.peer,
      };
      const participantsGroup = listUserAddGroup.map((friend) => ({
        userId: friend.userId,
        email: friend.email,
        userName: friend.userName,
        avatarUrl: friend.avatarUrl,
        enable: true,
        isReadLastMessage: false,
        peerId: friend.peerId,
      }));

      const data = {
        nameGroup: groupName,
        conversation_type: 'group',
        participants: [creator, ...participantsGroup],
      };
      const res = await conversationService.createNewGroup(data);
      setShowListFriend(false);
      setListUserAddGroup([]);
      setGroupName('');
      setMember(listUserAddGroup.length + 1);
      setShowCreateNewGroup(false);
      if (res.status === 201) {
        navigate(`/conversation/${res.data.metaData._id}`);
      } else {
        dispatch(setIsError());
      }
    };

    // Call api add new member
    const handleAddNewMember = async () => {
      if (listUserAddGroup.length !== 0) {
        const conversation = conversations.get(conversationId ?? '');
        if (conversation) {
          const data = {
            conversationId: conversation._id,
            conversation_type: conversation.conversation_type,
            newParticipants: listUserAddGroup,
          };
          await conversationService.handleAddNewMember(data);
          handleCloseForm();
        }
      }
    };

    // Handle click outside
    useEffect(() => {
      if (isShowCreateNewGroup) {
        const clickOutSide = (e: MouseEvent) => {
          if (
            modelRef.current &&
            !modelRef.current?.contains(e.target as Node)
          ) {
            handleCloseForm();
          }
        };

        document.addEventListener('mousedown', clickOutSide);

        return () => {
          document.removeEventListener('mousedown', clickOutSide);
        };
      }
    }, [isShowCreateNewGroup]);

    // Handle loading
    useEffect(() => {
      if (keyword === searchValue.trim() || searchValue.trim() === '')
        setIsLoading(false);
      else setIsLoading(true);
    }, [searchValue]);

    // Handle search
    useEffect(() => {
      const handleSearch = async () => {
        const res = await friendService.searchFriendByUserName(searchValue);
        if (res.status === 200) {
          setListFriend(res.data.metaData.friends);
          setKeyWord(res.data.metaData.keyword);
        } else {
          dispatch(setIsError());
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
          ref={modelRef}
          className={`grid grid-cols-6 animate__animated animate__fadeInDown ${
            showListFriend
              ? 'sm:w-[80%] lg:w-[70%]'
              : 'sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%]'
          } h-[90%] bg-white rounded-lg overflow-hidden`}
        >
          <div
            className={`${
              showListFriend ? 'col-span-3' : 'col-span-6'
            } relative px-10 py-6`}
          >
            <h1 className='text-xl pb-2 border-b border-slate-500'>
              {type === 'add' ? 'Add new Member' : 'Create new Group'}
            </h1>
            <div className={`${type === 'add' ? 'hidden' : 'mt-4'}`}>
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
              {listUserAddGroup.map((friend) => (
                <div key={friend.userId} className='mt-4'>
                  <AvatarUserAdd friend={friend} />
                </div>
              ))}
            </div>
            <div
              className={`absolute flex items-end justify-between w-full left-0 px-6 bottom-6`}
            >
              <div className='text-black font-light'>{`Member ${member - 1}${
                type !== 'add' ? '/2' : ''
              }`}</div>
              <div className='flex gap-3'>
                <button
                  className='px-4 py-1 rounded-lg border'
                  onClick={handleCloseForm}
                >
                  Close
                </button>
                <button
                  onClick={
                    type === 'add'
                      ? handleAddNewMember
                      : handleCreateNewGroupConversation
                  }
                  className={`px-4 py-1 rounded-lg bg-blue-500 text-white ${
                    type !== 'add' && (member < 2 || groupName === '')
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
              showListFriend ? 'col-span-3' : 'hidden'
            } px-4 xl:px-6 bg-[#f2f3f4] py-6`}
          >
            <Search
              className={'w-full bg-white'}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              isLoading={isLoading}
            />
            <hr className='my-4' />
            {loadingFriend ? (
              <div className='w-full h-full flex items-center justify-center'>
                <Loading />
              </div>
            ) : (
              <div className='max-h-create-conversation scrollbar-hide overflow-y-scroll'>
                {searchValue.trim() === ''
                  ? friends &&
                    Array.from(friends.values()).map((friend) => (
                      <div key={friend._id}>
                        <AvatarSearch
                          friend={friend}
                          setListUserAddGroup={setListUserAddGroup}
                          setMember={setMember}
                          isShowCreateNewGroup={isShowCreateNewGroup}
                        />
                      </div>
                    ))
                  : listFriend.map((friend) => (
                      <div key={friend._id}>
                        <AvatarSearch
                          friend={friend}
                          setListUserAddGroup={setListUserAddGroup}
                          setMember={setMember}
                          isShowCreateNewGroup={isShowCreateNewGroup}
                        />
                      </div>
                    ))}
              </div>
            )}
          </div>
        </div>

        <div
          className={`${
            loadingConversation ? 'fixed' : 'hidden'
          } top-0 left-0 bottom-0 right-0 z-[1001] flex items-center justify-center  w-screen h-screen bg-blackOverlay`}
        >
          <Loading />
        </div>
      </div>
    );
  }
);

export default CreateNewGroup;
