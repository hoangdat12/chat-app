import { RootState } from '../../app/store';
import { IFriend } from '../../ultils/interface/friend.interface';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { friendService } from './friendService';

export interface IInitialStateFriend {
  friends: Map<string, IFriend> | null;
  unconfirmed: Map<string, IFriend> | null;
  isLoading: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  totalNotifyAddFriend: string;
}

const initialState: IInitialStateFriend = {
  friends: null,
  unconfirmed: null,
  isLoading: false,
  status: 'idle',
  totalNotifyAddFriend: '0',
};

export const getFriendOfUser = createAsyncThunk('friend/friend', async () => {
  return await friendService.getFriendOfUser();
});

export const getUnconfirmedFriend = createAsyncThunk(
  'friend/unconfirmed',
  async () => {
    return await friendService.getUnconfirmedFriend();
  }
);

export const getTotalNotifyAddFriend = createAsyncThunk(
  'friend/totalNotify',
  async () => {
    return await friendService.getTotalNotifyAddFriend();
  }
);

export const confirmFriend = createAsyncThunk(
  'friend/confirm',
  async (friend: IFriend) => {
    return await friendService.confirmFriend(friend);
  }
);

export const refuseFriend = createAsyncThunk(
  'friend/refuse',
  async (friend: IFriend) => {
    return await friendService.refuseFriend(friend);
  }
);

const friendSlice = createSlice({
  name: 'friend',
  initialState: initialState,
  reducers: {
    // confirmFriend: (state, action: PayloadAction<IFriend>) => {
    //   const newFriend = action.payload;
    //   state.unconfirmed?.delete(newFriend.userId);
    //   state.friends?.set(newFriend.userId, newFriend);
    // },
    // refuseFriend: (state, action: PayloadAction<IFriend>) => {
    //   const refuse = action.payload;
    //   state.unconfirmed?.delete(refuse.userId);
    // },
    receivedAddFriend: (state, action: PayloadAction<IFriend>) => {
      const newConversationMap = new Map([
        [action.payload.userId, action.payload],
      ]);
      state.unconfirmed?.delete(action.payload.userId);
      if (state.unconfirmed) {
        state.unconfirmed = new Map([
          ...newConversationMap,
          ...state?.unconfirmed,
        ]);
      } else state.unconfirmed = newConversationMap;
      state.totalNotifyAddFriend = (
        parseInt(state.totalNotifyAddFriend) + 1
      ).toString();
    },
    cancelRequestAddFriend: (
      state,
      action: PayloadAction<{ userId: string }>
    ) => {
      state.unconfirmed?.delete(action.payload.userId);
      state.totalNotifyAddFriend = (
        parseInt(state.totalNotifyAddFriend) - 1
      ).toString();
    },
    readAllNotify: (state) => {
      state.totalNotifyAddFriend = '0';
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

        for (let friend of action.payload) {
          newFriend.set(friend.friends.userId, friend.friends);
        }

        state.friends = newFriend;
      })
      .addCase(getFriendOfUser.rejected, (state) => {
        state.status = 'failed';
        state.isLoading = false;
      })

      // Unconfirmed
      .addCase(getUnconfirmedFriend.pending, (state) => {
        state.status = 'pending';
        state.isLoading = true;
      })
      .addCase(getUnconfirmedFriend.fulfilled, (state, action) => {
        state.status = 'idle';
        state.isLoading = false;
        const newConfirmed = new Map<string, IFriend>();

        for (let waiter of action.payload) {
          newConfirmed.set(waiter.unconfirmed.userId, waiter.unconfirmed);
        }

        state.unconfirmed = newConfirmed;
      })
      .addCase(getUnconfirmedFriend.rejected, (state) => {
        state.status = 'failed';
        state.isLoading = false;
      })

      // Notify
      .addCase(getTotalNotifyAddFriend.pending, (state) => {
        state.status = 'pending';
        state.isLoading = true;
      })
      .addCase(getTotalNotifyAddFriend.fulfilled, (state, action) => {
        state.status = 'idle';
        state.isLoading = false;
        const totalNotifyAddFriend = action.payload.totalNotify;
        if (totalNotifyAddFriend > 5) {
          state.totalNotifyAddFriend = `${totalNotifyAddFriend}+`;
        } else {
          state.totalNotifyAddFriend = totalNotifyAddFriend.toString();
        }
      })
      .addCase(getTotalNotifyAddFriend.rejected, (state) => {
        state.status = 'failed';
        state.isLoading = false;
      })

      // Confirm
      .addCase(confirmFriend.pending, (state) => {
        state.status = 'pending';
        state.isLoading = true;
      })
      .addCase(confirmFriend.fulfilled, (state, action) => {
        state.status = 'idle';
        state.isLoading = false;

        const newFriend = action.payload;
        state.unconfirmed?.delete(newFriend.userId);
        state.friends?.set(newFriend.userId, newFriend);
      })
      .addCase(confirmFriend.rejected, (state) => {
        state.status = 'failed';
        state.isLoading = false;
      })

      // Refuse
      .addCase(refuseFriend.pending, (state) => {
        state.status = 'pending';
        state.isLoading = true;
      })
      .addCase(refuseFriend.fulfilled, (state, action) => {
        state.status = 'idle';
        state.isLoading = false;

        const newFriend = action.payload;
        state.unconfirmed?.delete(newFriend.userId);
      })
      .addCase(refuseFriend.rejected, (state) => {
        state.status = 'failed';
        state.isLoading = false;
      });
  },
});

export const {
  // confirmFriend,
  // refuseFriend,
  receivedAddFriend,
  cancelRequestAddFriend,
  readAllNotify,
} = friendSlice.actions;
export default friendSlice.reducer;
export const selectFriend = (state: RootState) => state.friend;
