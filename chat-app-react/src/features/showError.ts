import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

export interface IInitialStateNotify {
  isError: boolean;
  isSuccess: boolean;
  isNotify: boolean;
}

const initialState: IInitialStateNotify = {
  isError: false,
  isSuccess: false,
  isNotify: false,
};

const notifySlice = createSlice({
  name: 'notify',
  initialState,
  reducers: {
    setFlag: (
      state,
      action: PayloadAction<{ key: keyof IInitialStateNotify; value: boolean }>
    ) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
  },
});

export const { setFlag } = notifySlice.actions;

export const setIsError = createAsyncThunk(
  'notify/setIsError',
  async (_, { dispatch }) => {
    dispatch(setFlag({ key: 'isError', value: true }));
    setTimeout(() => {
      dispatch(setFlag({ key: 'isError', value: false }));
    }, 3000);
  }
);

export const setIsSuccess = createAsyncThunk(
  'notify/setIsSuccess',
  async (_, { dispatch }) => {
    dispatch(setFlag({ key: 'isSuccess', value: true }));
    setTimeout(() => {
      dispatch(setFlag({ key: 'isSuccess', value: false }));
    }, 3000);
  }
);

export const setIsNotify = createAsyncThunk(
  'notify/setIsNotify',
  async (_, { dispatch }) => {
    dispatch(setFlag({ key: 'isNotify', value: true }));
    setTimeout(() => {
      dispatch(setFlag({ key: 'isNotify', value: false }));
    }, 3000);
  }
);

export default notifySlice.reducer;
export const selectShowError = (state: RootState) => state.showError;
