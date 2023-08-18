import { RootState } from '../../app/store';
import { IPagination } from '../../ultils/interface';
import { INotify } from '../../ultils/interface/notify.interface';
import { PayloadAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notifyService } from './notifyService';

export interface IInitialStateNotify {
  notifies: INotify[];
  isLoading: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  numberNotifyUnRead: number;
}

const initialState: IInitialStateNotify = {
  notifies: [],
  isLoading: false,
  status: 'idle',
  numberNotifyUnRead: 0,
};

export const getAllNotify = createAsyncThunk(
  'notify/getAll',
  async (pagination: IPagination | undefined) => {
    return await notifyService.getAllNotify(pagination);
  }
);

export const readNotify = createAsyncThunk(
  'notify/readNotify',
  async (notifyId: string) => {
    return await notifyService.readNotify(notifyId);
  }
);

const notifySlice = createSlice({
  name: 'notify',
  initialState,
  reducers: {
    receivedNotify: (state, action: PayloadAction<INotify>) => {
      state.notifies = [action.payload, ...state.notifies];
      state.numberNotifyUnRead += 1;
    },
    deleteNotify: (state, action: PayloadAction<INotify>) => {
      state.notifies = state.notifies.filter(
        (notify) => notify._id !== action.payload._id
      );
      if (!action.payload.notify_readed) {
        state.numberNotifyUnRead -= 1;
      }
    },
    increNotifyNumber: (state) => {
      state.numberNotifyUnRead++;
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
        const { unRead, notifies } = action.payload.data.metaData;
        state.notifies = notifies;
        state.numberNotifyUnRead = unRead;
      })
      .addCase(getAllNotify.rejected, (state) => {
        state.isLoading = false;
        state.status = 'failed';
      })

      .addCase(readNotify.pending, (state) => {
        state.isLoading = true;
        state.status = 'pending';
      })
      .addCase(readNotify.fulfilled, (state) => {
        state.isLoading = false;
        state.status = 'succeeded';
        state.numberNotifyUnRead = 0;
        state.notifies[0].notify_readed = true;
      })
      .addCase(readNotify.rejected, (state) => {
        state.isLoading = false;
        state.status = 'failed';
      });
  },
});

export const { receivedNotify, deleteNotify } = notifySlice.actions;
export default notifySlice.reducer;
export const selectNotify = (state: RootState) => state.notify;
