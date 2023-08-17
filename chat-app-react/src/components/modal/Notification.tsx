import { FC, memo, useContext, useEffect, useState } from 'react';
import Button from '../button/Button';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { confirmFriend, refuseFriend } from '../../features/friend/friendSlice';
import Loading from '../button/Loading';
import { SocketContext } from '../../ultils/context/Socket';
import { INotify } from '../../ultils/interface';
import { useNavigate } from 'react-router-dom';
import {
  deleteNotify,
  getAllNotify,
  receivedNotify,
  selectNotify,
} from '../../features/notify/notifySlice';
import { Notify } from '../notify/Notify';
import { NotifyAlert } from '../alert/Alert';

export interface INotificationProps {
  showNotification: boolean;
  setShowNotification: (value: boolean) => void;
}

const Notification: FC<INotificationProps> = memo(
  ({ showNotification, setShowNotification }) => {
    const [showNotify, setShowNotify] = useState(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const socket = useContext(SocketContext);

    const { notifies, isLoading } = useAppSelector(selectNotify);

    // Confirm add friend
    const handleConfirm = async (notify: INotify) => {
      dispatch(confirmFriend(notify.notify_friend));
      dispatch(deleteNotify(notify));
    };

    // Refuse add friend
    const handleDelete = (notify: INotify) => {
      dispatch(refuseFriend(notify.notify_friend));
      dispatch(deleteNotify(notify));
    };

    // View Profile's friend
    const handleViewProfile = (friendId: string) => {
      setShowNotification(false);
      navigate(`/profile/${friendId}`);
    };

    // Socket received request add friend
    const handleReceivedNotify = (data: INotify) => {
      setShowNotify(true);
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
      if (showNotify) {
        const timer = setTimeout(() => {
          setShowNotify(false);
        }, 2000);

        return () => clearTimeout(timer);
      }
    }, [showNotify]);

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
          } absolute top-[130%] right-0 h-[500px] min-w-[340px] rounded-md rounded-tr-none bg-gray-50 duration-300 shadow-default `}
        >
          <>
            {isLoading ? (
              <div className='flex items-center justify-center w-full h-[464px]'>
                <Loading />
              </div>
            ) : (
              <div className='h-[464px] border-b overflow-y-scroll overflow-x-hidden'>
                {notifies &&
                  notifies.map((notify) => (
                    <div
                      key={notify._id}
                      className='px-4 py-4 hover:bg-white duration-300 min-h-[90px] border-b'
                    >
                      <Notify
                        notify={notify}
                        handleConfirm={() => handleConfirm(notify)}
                        handleDelete={() => handleDelete(notify)}
                        handleViewProfile={() =>
                          handleViewProfile(notify.notify_friend._id)
                        }
                      />
                    </div>
                  ))}
              </div>
            )}
            <div className='flex items-center justify-center h-[36px]'>
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
        {showNotify && <NotifyAlert msg={'You have some new notify'} />}
      </>
    );
  }
);

export default Notification;
