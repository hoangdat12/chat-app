import { FC, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import Avatar, { AvatarSquare } from '../avatars/Avatar';
import Search from '../search/Search';
import ConversationInfor, {
  ConversationInforMobile,
} from './ConversationInfor';
import LogoPage from '../../assets/Logo2.png';
import { IConversation, IUser } from '../../ultils/interface';
import { getNameAndAvatarOfConversation } from '../../ultils';
import { useAppDispatch } from '../../app/hook';
import { readLastMessage } from '../../features/conversation/conversationSlice';
import useDebounce from '../../hooks/useDebounce';
import { conversationService } from '../../features/conversation/conversationService';

export interface IPropConversationList {
  conversations: Map<string, IConversation>;
  user: IUser | null;
  handleSelectConversation: (conversationId: string) => void;
  // Active Link or not
  to?: boolean;
}

const ConversationList: FC<IPropConversationList> = ({
  conversations,
  user,
  handleSelectConversation,
}) => {
  const { conversationId } = useParams();
  // For first
  const [active, setActive] = useState<string>(
    conversationId ?? conversations.keys().next().value
  );
  const [isReadLastMessage, setIsReadLastMessage] = useState(true);
  // For after send message
  const [activeAfterSendMessage, setActiveAfterSendMessage] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [listConversations, setListConversations] = useState<IConversation[]>();
  const [isShowSearchResult, setIsShowSearchResult] = useState(false);
  const dispatch = useAppDispatch();

  const handleActive = (conversation: IConversation) => {
    setActive(conversation._id);
    setActiveAfterSendMessage(conversation._id);
    if (!isReadLastMessage) {
      handleSelectConversation(conversation._id);
      dispatch(readLastMessage({ user, conversationId: conversation._id }));
    }
  };
  const debounceValue = useDebounce(searchValue, 500);

  useEffect(() => {
    if (searchValue.trim() === '') {
      setIsShowSearchResult(false);
      setListConversations([]);
    }
  }, [searchValue]);

  useEffect(() => {
    const handleSearchConversation = async () => {
      const res = await conversationService.searchConversationByName(
        searchValue.trim()
      );
      console.log(res);
      if (res.status === 200) {
        setListConversations(res.data.metaData);
        setIsShowSearchResult(true);
      }
    };
    if (searchValue.trim() !== '') {
      handleSearchConversation();
    }
  }, [debounceValue]);

  return (
    <div className='xl:col-span-3 md:col-span-4 w-full sm:w-[80px] md:w-auto bg-[#f2f3f4] h-full py-6 sm:py-8 overflow-hidden'>
      <div className='flex justify-center px-4'>
        <Search
          className={'bg-white flex sm:hidden md:flex'}
          width={'w-full'}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          isShow={isShowSearchResult}
          listResult={listConversations}
          setIsShow={setIsShowSearchResult}
        />
        <AvatarSquare
          avatarUrl={LogoPage}
          className={`hidden sm:block md:hidden w-10 h-10 duration-300 whitespace-nowrap animate__bounceIn `}
        />
      </div>

      {/* Friend online on Mobile*/}
      <div className='flex sm:hidden gap-3 my-4 mx-6 overflow-x-scroll scrollbar-hide'>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((ele) => (
          <div className='relative' key={ele}>
            <Avatar
              className={'h-12 w-12'}
              avatarUrl={
                'https://i.pinimg.com/originals/2b/0f/7a/2b0f7a9533237b7e9b49f62ba73b95dc.jpg'
              }
            />
            <span className='absolute bottom-[2px] right-0 p-[6px] bg-green-500 rounded-full'></span>
          </div>
        ))}
      </div>

      <div className='max-h-[calc(100vh-14rem)] sm:max-h-[calc(100vh-10.5rem)] mt-4 border-t border-[#e8ebed] scroll-container overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent'>
        {Array.from(conversations.values()).map(
          (conversation: IConversation, idx) => {
            const { name, avatarUrl } = getNameAndAvatarOfConversation(
              conversation,
              user
            );
            return (
              <div key={idx}>
                {/* Mobile */}
                <Link
                  to={`/conversation/${conversation._id}`}
                  key={`${conversation._id}`}
                  className={`block sm:hidden md:block cursor-pointer ${
                    activeAfterSendMessage === conversation._id ||
                    (active === conversation._id &&
                      activeAfterSendMessage === '' &&
                      innerWidth >= 640)
                      ? 'bg-white'
                      : ''
                  }`}
                  onClick={() => handleActive(conversation)}
                >
                  <ConversationInfor
                    active={active === conversation._id}
                    avatarUrl={avatarUrl}
                    nickName={name ?? 'undifined'}
                    status={'Active'}
                    conversation={conversation}
                    isReadLastMessage={isReadLastMessage}
                    setIsReadLastMessage={setIsReadLastMessage}
                  />
                </Link>
                <div
                  key={`${conversation._id}10`}
                  className={`hidden sm:block md:hidden cursor-pointer ${
                    activeAfterSendMessage === conversation._id ||
                    (active === conversation._id &&
                      activeAfterSendMessage === '')
                      ? 'bg-white'
                      : ''
                  } w-full border-b-[2px] border-[#e8ebed]`}
                  onClick={() => handleActive(conversation)}
                >
                  <div className='flex justify-center'>
                    <ConversationInforMobile
                      avatarUrl={
                        avatarUrl ??
                        'https://i0.wp.com/thatnhucuocsong.com.vn/wp-content/uploads/2022/04/Anh-avatar-dep-anh-dai-dien-FB-Tiktok-Zalo.jpg?ssl=1'
                      }
                    />
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default ConversationList;
