import { IPagination, IResponse } from '../../ultils/interface';
import { INotify } from '../../ultils/interface/notify.interface';
import myAxios from '../../ultils/myAxios';

const getAllNotify = async (
  pagination: IPagination = { limit: 10, page: 1, sortedBy: 'ctime' }
): Promise<IResponse<INotify[]>> => {
  const { limit, page, sortedBy } = pagination;
  const res = await myAxios.get(
    `/notify?page=${page}&limit=${limit}$sortBy=${sortedBy}`
  );
  console.log(res);
  return res;
};

export const notifyService = {
  getAllNotify,
};
