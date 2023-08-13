import { RootState } from '../../app/store';
import { IFriend } from '../../ultils/interface/friend.interface';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { friendService } from './friendService';

export interface IInitialStateFriend {
  friends: Map<string, IFriend> | null;
  unconfirmed: Map<string, IFriend> | null;
  isLoading: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const initialState: IInitialStateFriend = {
  friends: null,
  unconfirmed: null,
  isLoading: false,
  status: 'idle',
};

export const getFriendOfUser = createAsyncThunk(
  'friend/friend',
  async (userId: string) => {
    return await friendService.getFriendOfUser(userId);
  }
);

export const confirmFriend = createAsyncThunk(
  'friend/confirm',
  async (friend: IFriend) => {
    return await friendService.confirmFriend(friend._id);
  }
);

export const refuseFriend = createAsyncThunk(
  'friend/refuse',
  async (friend: IFriend) => {
    return await friendService.refuseFriend(friend._id);
  }
);

const friendSlice = createSlice({
  name: 'friend',
  initialState: initialState,
  reducers: {
    cancelRequestAddFriend: (
      state,
      action: PayloadAction<{ userId: string }>
    ) => {
      state.unconfirmed?.delete(action.payload.userId);
    },
  },
  extraReducers: (builder) => {
    // Friend
    builder
      .addCase(getFriendOfUser.pending, (state) => {
        state.status = 'pending';
        state.isLoading = true;
      })
      .addCase(getFriendOfUser.fulfilled, (state, action) => {
        state.status = 'idle';
        state.isLoading = false;
        const newFriend = new Map<string, IFriend>();
        for (let friend of action.payload.data.metaData) {
          newFriend.set(friend._id, friend);
        }
        state.friends = newFriend;
      })
      .addCase(getFriendOfUser.rejected, (state) => {
        state.status = 'failed';
        state.isLoading = false;
      });

    // Confirm
    // .addCase(confirmFriend.pending, (state) => {
    //   state.status = 'pending';
    //   state.isLoading = true;
    // })
    // .addCase(confirmFriend.fulfilled, (state, action) => {
    //   state.status = 'idle';
    //   state.isLoading = false;

    //   const newFriend = action.payload;
    //   state.unconfirmed?.delete(newFriend._id);
    //   state.friends?.set(newFriend._id, newFriend);
    // })
    // .addCase(confirmFriend.rejected, (state) => {
    //   state.status = 'failed';
    //   state.isLoading = false;
    // })

    // // Refuse
    // .addCase(refuseFriend.pending, (state) => {
    //   state.status = 'pending';
    //   state.isLoading = true;
    // })
    // .addCase(refuseFriend.fulfilled, (state, action) => {
    //   state.status = 'idle';
    //   state.isLoading = false;

    //   const newFriend = action.payload;
    //   state.unconfirmed?.delete(newFriend._id);
    // })
    // .addCase(refuseFriend.rejected, (state) => {
    //   state.status = 'failed';
    //   state.isLoading = false;
    // });
  },
});

export const {
  // confirmFriend,
  // refuseFriend,
  cancelRequestAddFriend,
} = friendSlice.actions;
export default friendSlice.reducer;
export const selectFriend = (state: RootState) => state.friend;
