import { RootState } from '../../app/store';
import { IPagination } from '../../ultils/interface';
import { INotify } from '../../ultils/interface/notify.interface';
import { PayloadAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notifyService } from './notifyService';

export interface IInitialStateNotify {
  notifies: INotify[];
  isLoading: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  numberUnRead: number;
}

const initialState: IInitialStateNotify = {
  notifies: [],
  isLoading: false,
  status: 'idle',
  numberUnRead: 0,
};

export const getAllNotify = createAsyncThunk(
  'notify/getAll',
  async (pagination: IPagination | undefined) => {
    return await notifyService.getAllNotify(pagination);
  }
);

const notifySlice = createSlice({
  name: 'notify',
  initialState,
  reducers: {
    receivedNotify: (state, action: PayloadAction<INotify>) => {
      state.notifies = [action.payload, ...state.notifies];
    },
    deleteNotify: (state, action: PayloadAction<INotify>) => {
      state.notifies = state.notifies.filter(
        (notify) => notify._id !== action.payload._id
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllNotify.pending, (state) => {
        state.isLoading = true;
        state.status = 'pending';
      })
      .addCase(getAllNotify.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = 'succeeded';
        state.notifies = action.payload.data.metaData;
      })
      .addCase(getAllNotify.rejected, (state) => {
        state.isLoading = false;
        state.status = 'failed';
      });
  },
});

export const { receivedNotify, deleteNotify } = notifySlice.actions;
export default notifySlice.reducer;
export const selectNotify = (state: RootState) => state.notify;
