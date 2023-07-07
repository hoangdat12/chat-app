import { FC, memo, useContext, useEffect } from 'react';
import { UserAddFriend } from '../box/UserBox';
import Button from '../button/Button';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import {
  cancelRequestAddFriend,
  confirmFriend,
  getUnconfirmedFriend,
  receivedAddFriend,
  refuseFriend,
  selectFriend,
} from '../../features/friend/friendSlice';
import Loading from '../button/Loading';
import { IFriend } from '../../ultils/interface/friend.interface';
import { SocketContext } from '../../ultils/context/Socket';
import { IUser } from '../../ultils/interface';
import { getUsername } from '../../ultils';
import { useNavigate } from 'react-router-dom';

export interface INotificationProps {
  showNotification: boolean;
  setShowNotification: (value: boolean) => void;
}

const Notification: FC<INotificationProps> = memo(
  ({ showNotification, setShowNotification }) => {
    const { unconfirmed, isLoading } = useAppSelector(selectFriend);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const socket = useContext(SocketContext);

    // Confirm add friend
    const handleConfirm = async (userAddFriend: IFriend) => {
      dispatch(confirmFriend(userAddFriend));
    };

    // Refuse add friend
    const handleDelete = (userAddFriend: IFriend) => {
      dispatch(refuseFriend(userAddFriend));
    };

    // View Profile's friend
    const handleViewProfile = (friendId: string) => {
      setShowNotification(false);
      navigate(`/profile/${friendId}`);
    };

    // Socket received request add friend
    const handleReceivedAddRequest = (data: IUser) => {
      const userAddFriend = {
        userId: data._id,
        email: data.email,
        userName: getUsername(data),
        avatarUrl: data.avatarUrl,
      };
      dispatch(receivedAddFriend(userAddFriend));
    };

    // Socket received Friend cancel request
    const handleCacncelFriend = (data: IUser) => {
      dispatch(cancelRequestAddFriend({ userId: data._id }));
    };

    // Get list request add friend
    useEffect(() => {
      dispatch(getUnconfirmedFriend());
    }, []);

    useEffect(() => {
      socket.on('connection', (data: any) => {
        console.log(data);
      });
      socket.on('onAddFriend', handleReceivedAddRequest);
      socket.on('onCancelFriend', handleCacncelFriend);

      return () => {
        socket.off('connection');
        socket.off('onAddFriend');
      };
    }, []);

    return (
      <>
        <div
          className={`${
            !showNotification && 'hidden'
          } absolute top-[130%] right-0 min-h-[400px] min-w-[300px] rounded-md rounded-tr-none bg-gray-50 duration-300 cursor-pointer shadow-default `}
        >
          <>
            {isLoading ? (
              <div className='flex items-center justify-center w-full min-h-[360px]'>
                <Loading />
              </div>
            ) : (
              <div className='min-h-[360px] border-b'>
                {unconfirmed &&
                  Array.from(unconfirmed.values()).map((userAddFriend) => (
                    <div
                      key={userAddFriend.userId}
                      className='px-4 py-4 hover:bg-white duration-300 min-h-[90px] border-b'
                    >
                      <UserAddFriend
                        avatarUrl={userAddFriend.avatarUrl}
                        userName={userAddFriend.userName}
                        handleConfirm={() => handleConfirm(userAddFriend)}
                        handleDelete={() => handleDelete(userAddFriend)}
                        handleViewProfile={() =>
                          handleViewProfile(userAddFriend.userId)
                        }
                      />
                    </div>
                  ))}
              </div>
            )}
            <div className='flex items-center justify-center h-[40px]'>
              <Button
                className={'w-full h-full'}
                text={'More'}
                fontSize={'text-sm'}
                border={'border-none'}
                hover={'hover:bg-gray-200 '}
              />
            </div>
          </>
        </div>
        <div
          className={`${
            !showNotification && 'hidden'
          } absolute top-[130%] -translate-y-[100%] right-[50%] translate-x-1/2 border-8 border-transparent border-b-gray-50 duration-300`}
        ></div>
      </>
    );
  }
);

export default Notification;
