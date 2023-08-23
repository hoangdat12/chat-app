import { IPagination, IResponse } from '../../ultils/interface';
import { INotify } from '../../ultils/interface/notify.interface';
import myAxios from '../../ultils/myAxios';

const getAllNotify = async (
  pagination: IPagination = { limit: 20, page: 1, sortedBy: 'ctime' }
): Promise<
  IResponse<{
    unRead: number;
    notifies: INotify[];
  }>
> => {
  const { limit, page, sortedBy } = pagination;
  const res = await myAxios.get(
    `/notify?page=${page}&limit=${limit}$sortBy=${sortedBy}`
  );
  return res;
};

const readNotify = async (notifyId: string): Promise<IResponse<any>> => {
  const res = await myAxios.patch(`/notify/${notifyId}`);
  return res;
};

const deleteNotify = async (notifyId: string): Promise<IResponse<any>> => {
  const res = await myAxios.delete(`/notify/${notifyId}`);
  return res;
};

export const notifyService = {
  getAllNotify,
  readNotify,
  deleteNotify,
};
