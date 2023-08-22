import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../app/hook';
import Layout from '../components/layout/Layout';
import { Notify } from '../components/notify/Notify';
import { selectNotify } from '../features/notify/notifySlice';
import { notifyService } from '../features/notify/notifyService';
import { INotify, IPagination } from '../ultils/interface';

const ManageNotification = () => {
  const { notifies: notifiesSlice } = useAppSelector(selectNotify);
  const [notifies, setNotifies] = useState<INotify[]>(notifiesSlice);

  const handleConfirm = () => {};

  const handleDelete = () => {};

  const handleViewProfile = () => {};

  const bottomOfListRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [endCall, setEndCall] = useState(false);

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
                handleConfirm={handleConfirm}
                handleDelete={handleDelete}
                handleViewProfile={handleViewProfile}
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
