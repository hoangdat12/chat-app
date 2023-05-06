import { ILoginData } from "../../pages/authPage/Login";
import { IRegisterData } from "../../pages/authPage/Register";
import myAxios from "../../ultils/myAxios";
import { IUser } from "./authSlice";

export interface IInformationUser {
  data: {
    metaData: {
      user: IUser;
      token: string;
    };
    message: string;
    status: number;
  };
}

const login = async (data: ILoginData) => {
  const response = (await myAxios.post(
    "/auth/login",
    data
  )) as IInformationUser;
  if (response.data.status === 200) {
    localStorage.setItem("user", JSON.stringify(response.data.metaData.user));
    localStorage.setItem(
      "accessToken",
      JSON.stringify(response.data.metaData.token)
    );
  }
  console.log(response);
  return response.data.metaData;
};

const getInforUserWithOauth2 = async () => {
  const response = (await myAxios.get("/auth/status", {
    withCredentials: true,
  })) as IInformationUser;

  if (response.data.status === 200) {
    localStorage.setItem("user", JSON.stringify(response.data.metaData.user));
    localStorage.setItem("token", JSON.stringify(response.data.metaData.token));
  }
  console.log(response);
  return response.data.metaData;
};

export const register = async (data: IRegisterData) => {
  const response = await myAxios.post("/auth/register", data);
  return response.data;
};

export const authService = {
  login,
  getInforUserWithOauth2,
  register,
};
