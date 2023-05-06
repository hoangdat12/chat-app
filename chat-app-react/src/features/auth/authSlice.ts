import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ILoginData } from "../../pages/authPage/Login";
import { authService } from "./authService";
import { RootState } from "../../app/store";

export interface IUser {
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  role: string;
  loginWith: string;
}

export interface IInitialState {
  user: null | IUser;
  token: null | string;
  isLoading: boolean;
  status: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: IInitialState = {
  user: null,
  token: null,
  isLoading: false,
  status: "idle",
};

export const login = createAsyncThunk(
  "auth/login",
  async (data: ILoginData) => {
    return await authService.login(data);
  }
);

export const getInforUserWithOauth2 = createAsyncThunk(
  "auth/login/oauth2",
  async () => {
    return await authService.getInforUserWithOauth2();
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "pending";
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "idle";
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state) => {
        state.status = "failed";
        state.isLoading = false;
      })

      .addCase(getInforUserWithOauth2.pending, (state) => {
        state.status = "pending";
        state.isLoading = true;
      })
      .addCase(getInforUserWithOauth2.fulfilled, (state, action) => {
        state.status = "idle";
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(getInforUserWithOauth2.rejected, (state) => {
        state.status = "failed";
        state.isLoading = false;
      });
  },
});

export default authSlice.reducer;
export const selectAuth = (state: RootState) => state.auth;