import { FC, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import Avatar from '../avatars/Avatar';
import Search from '../search/Search';
import ConversationInfor, {
  ConversationInforMobile,
} from './ConversationInfor';
import { IConversation, IUser } from '../../ultils/interface';
import { getNameAndAvatarOfConversation } from '../../ultils';
import { useAppDispatch } from '../../app/hook';
import { readLastMessage } from '../../features/conversation/conversationSlice';
import useDebounce from '../../hooks/useDebounce';
import { conversationService } from '../../features/conversation/conversationService';
import { setIsError } from '../../features/showError';

export interface IPropConversationList {
  conversations: Map<string, IConversation>;
  user: IUser | null;
  handleSelectConversation: (conversationId: string) => void;
  // Active Link or not
  to?: boolean;
  showListConversationSM?: boolean;
}

const ConversationList: FC<IPropConversationList> = ({
  conversations,
  user,
  handleSelectConversation,
  showListConversationSM,
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
  const debounceValue = useDebounce(searchValue, 500);

  // Active conversation is watching
  const handleActive = (conversation: IConversation) => {
    setActive(conversation._id);
    setActiveAfterSendMessage(conversation._id);
    if (!isReadLastMessage) {
      handleSelectConversation(conversation._id);
      dispatch(readLastMessage({ user, conversationId: conversation._id }));
    }
  };

  // Close modal result search value
  useEffect(() => {
    if (searchValue.trim() === '') {
      setIsShowSearchResult(false);
      setListConversations([]);
    }
  }, [searchValue]);

  useEffect(() => {
    if (conversationId) setActiveAfterSendMessage(conversationId);
  }, [conversationId]);

  // Search
  useEffect(() => {
    const handleSearchConversation = async () => {
      const res = await conversationService.searchConversationByName(
        searchValue.trim()
      );
      if (res.status === 200) {
        setListConversations(res.data.metaData);
        setIsShowSearchResult(true);
      } else {
        dispatch(setIsError());
      }
    };
    if (searchValue.trim() !== '') {
      handleSearchConversation();
    }
  }, [debounceValue]);

  return (
    <div
      className={`xl:col-span-3 md:col-span-4 w-full md:w-full ${
        showListConversationSM ? 'sm:w-[360px]' : 'sm:w-[80px]'
      } md:w-auto bg-[#f2f3f4] h-full py-6 sm:py-8 overflow-hidden duration-300`}
    >
      <div className='flex justify-center px-4'>
        <Search
          className={'bg-white flex'}
          width={'w-full'}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          isShow={isShowSearchResult}
          listResult={listConversations}
          setIsShow={setIsShowSearchResult}
          showListConversationSM={showListConversationSM}
        />
      </div>

      {/* Friend online on Mobile*/}
      {conversations && !conversations.size ? (
        <div className='flex items-center justify-center w-full h-full px-8'>
          <p className='text-center text-xl'>You don't have any conversation</p>
        </div>
      ) : (
        <>
          <div className='flex sm:hidden gap-3 my-4 mx-6 overflow-x-scroll scrollbar-hide'>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((ele) => (
              <div className='relative' key={ele}>
                <Avatar
                  className={'h-12 w-12 min-h-[3rem] min-w-[3rem]'}
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
                    {/* Mobile and Responsive for > MD */}
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
                    {/* For sm */}
                    <div
                      key={`${conversation._id}10`}
                      className={`hidden sm:block md:hidden cursor-pointer ${
                        activeAfterSendMessage === conversation._id ||
                        (active === conversation._id &&
                          activeAfterSendMessage === '')
                          ? 'bg-white'
                          : ''
                      } w-full border-b-[2px] border-[#e8ebed] whitespace-nowrap overflow-visible`}
                      onClick={() => handleActive(conversation)}
                    >
                      {showListConversationSM ? (
                        <Link
                          to={`/conversation/${conversation._id}`}
                          key={`${conversation._id}`}
                          className={`cursor-pointer ${
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
                      ) : (
                        <Link
                          to={`/conversation/${conversation._id}`}
                          key={`${conversation._id}`}
                          className={`cursor-pointer ${
                            activeAfterSendMessage === conversation._id ||
                            (active === conversation._id &&
                              activeAfterSendMessage === '' &&
                              innerWidth >= 640)
                              ? 'bg-white'
                              : ''
                          }`}
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
                        </Link>
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ConversationList;
