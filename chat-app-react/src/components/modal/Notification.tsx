import { FC, memo, useContext, useEffect } from 'react';
import { UserAddFriend } from '../box/UserBox';
import Button from '../button/Button';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { confirmFriend, refuseFriend } from '../../features/friend/friendSlice';
import Loading from '../button/Loading';
import { IFriend } from '../../ultils/interface/friend.interface';
import { SocketContext } from '../../ultils/context/Socket';
import { INotify } from '../../ultils/interface';
import { useNavigate } from 'react-router-dom';
import {
  deleteNotify,
  getAllNotify,
  receivedNotify,
  selectNotify,
} from '../../features/notify/notifySlice';

export interface INotificationProps {
  showNotification: boolean;
  setShowNotification: (value: boolean) => void;
}

const Notification: FC<INotificationProps> = memo(
  ({ showNotification, setShowNotification }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const socket = useContext(SocketContext);

    const { notifies, isLoading } = useAppSelector(selectNotify);

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
    const handleReceivedNotify = (data: INotify) => {
      dispatch(receivedNotify(data));
    };

    // Socket received Friend cancel request
    const handleDeleteNotify = (data: INotify) => {
      dispatch(deleteNotify(data));
    };

    // Get list request add friend
    useEffect(() => {
      dispatch(getAllNotify());
    }, []);
    useEffect(() => {
      socket.on('connection', (data: any) => {
        console.log(data);
      });
      socket.on('receivedNotify', handleReceivedNotify);
      socket.on('deleteNotify', handleDeleteNotify);

      return () => {
        socket.off('receivedNotify');
        socket.off('deleteNotify');
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
                {notifies &&
                  notifies.map((notify) => (
                    <div
                      key={notify._id}
                      className='px-4 py-4 hover:bg-white duration-300 min-h-[90px] border-b'
                    >
                      <UserAddFriend
                        notify={notify}
                        handleConfirm={() =>
                          handleConfirm(notify.notify_friend)
                        }
                        handleDelete={() => handleDelete(notify.notify_friend)}
                        handleViewProfile={() =>
                          handleViewProfile(notify.notify_friend.userId)
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
