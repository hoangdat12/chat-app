import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hook';
import Layout from '../components/layout/Layout';
import { Notify } from '../components/notify/Notify';
import { deleteNotify, selectNotify } from '../features/notify/notifySlice';
import { notifyService } from '../features/notify/notifyService';
import { INotify, IPagination } from '../ultils/interface';
import { setIsError } from '../features/showError';
import { confirmFriend, refuseFriend } from '../features/friend/friendSlice';
import { useNavigate } from 'react-router-dom';

const ManageNotification = () => {
  const { notifies: notifiesSlice } = useAppSelector(selectNotify);
  const [notifies, setNotifies] = useState<INotify[]>(notifiesSlice);

  const navigate = useNavigate();

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
    if (friendId) {
      navigate(`/profile/${friendId}`);
    }
  };

  const bottomOfListRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [endCall, setEndCall] = useState(false);

  const dispatch = useAppDispatch();

  const handleScroll = () => {
    if (
      bottomOfListRef.current &&
      bottomOfListRef.current.getBoundingClientRect().bottom <= 938 &&
      !endCall
    ) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const getNotify = async () => {
      const pagination: IPagination = {
        limit: 20,
        page: currentPage,
        sortedBy: 'ctime',
      };
      const res = await notifyService.getAllNotify(pagination);
      if (res.status === 200) {
        if (res.data.metaData.notifies.length !== 0) {
          setNotifies((prev) => [...prev, ...res.data.metaData.notifies]);
        } else {
          setEndCall(true);
        }
      } else {
        dispatch(setIsError());
      }
    };

    getNotify();
  }, [currentPage]);

  return (
    <Layout>
      <div
        onScroll={handleScroll}
        className='flex items-center justify-center w-full h-full overflow-scroll'
      >
        <div className='xl:w-3/5 h-full bg-gray-100 px-8 py-6'>
          <h1 className='text-3xl font-medium'>Notifications</h1>
          <div ref={bottomOfListRef} className='flex flex-col gap-4 mt-8'>
            {notifies.map((notify) => (
              <Notify
                notify={notify}
                handleConfirm={() => handleConfirm(notify)}
                handleDelete={() => handleDelete(notify)}
                handleViewProfile={() =>
                  handleViewProfile(notify.notify_friend._id)
                }
                fontSize={'text-lg'}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManageNotification;
