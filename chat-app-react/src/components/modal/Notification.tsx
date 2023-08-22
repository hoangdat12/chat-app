import { FC, memo, useEffect, useRef } from 'react';
import Button from '../button/Button';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { confirmFriend, refuseFriend } from '../../features/friend/friendSlice';
import Loading from '../button/Loading';
import { INotify } from '../../ultils/interface';
import { useNavigate } from 'react-router-dom';
import {
  deleteNotify,
  getAllNotify,
  selectNotify,
} from '../../features/notify/notifySlice';
import { Notify } from '../notify/Notify';
import useClickOutside from '../../hooks/useClickOutside';
import { getUserLocalStorageItem } from '../../ultils';

export interface INotificationProps {
  showNotification: boolean;
  setShowNotification: (value: boolean) => void;
}

const userLocal = getUserLocalStorageItem();

const Notification: FC<INotificationProps> = memo(
  ({ showNotification, setShowNotification }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const modelRef = useRef<HTMLDivElement | null>(null);

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
      if (friendId) {
        navigate(`/profile/${friendId}`);
      }
    };

    useClickOutside(modelRef, () => setShowNotification(false), 'mousedown');

    // Get list request add friend
    useEffect(() => {
      dispatch(getAllNotify());
    }, []);

    return (
      <>
        <div
          ref={modelRef}
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
                {notifies && notifies.length !== 0 ? (
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
                  ))
                ) : (
                  <div className='flex items-center justify-center w-full h-full text-gray-600 text-sm'>
                    You don't have any notifications
                  </div>
                )}
              </div>
            )}
            <div className='flex items-center justify-center h-[36px]'>
              <Button
                className={'w-full h-full'}
                text={'More'}
                fontSize={'text-sm'}
                border={'border-none'}
                hover={'hover:bg-gray-200 '}
                onClick={() => navigate(`/notification/${userLocal._id}`)}
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
