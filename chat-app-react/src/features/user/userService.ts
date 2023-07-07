import { IResponse } from '../../ultils/interface';
import { IDataSearchUser } from '../../ultils/interface/user.interface';
import myAxios from '../../ultils/myAxios';

const findUserByName = async (
  keyword: string,
  page: number = 1,
  limit: number = 20
): Promise<IResponse<IDataSearchUser>> => {
  const res = await myAxios.get(
    `/user/search?q=${keyword.trim()}&page=${page}&limit=${limit}`
  );
  return res;
};

export const userService = {
  findUserByName,
};
