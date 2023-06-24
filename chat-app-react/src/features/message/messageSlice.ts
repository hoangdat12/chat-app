import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { messageService } from './messageService';
import {
  IDataGetMessageOfConversation,
  IMessage,
  IMessageInitialState,
} from '../../ultils/interface';

const initialState: IMessageInitialState = {
  messages: [],
  isLoading: false,
  status: 'idle',
};

export const fetchMessageOfConversation = createAsyncThunk(
  'message/get',
  async (data: IDataGetMessageOfConversation) => {
    return await messageService.fetchMessageOfConversation(
      data.conversation_type,
      data.conversationId
    );
  }
);

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    createNewMessage: (state, action: PayloadAction<IMessage>) => {
      // state.messages = [action.payload, ...state.messages];
    },
    deleteMessage: (state, action: PayloadAction<string>) => {
      console.log(action);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessageOfConversation.pending, (state) => {
        state.isLoading = true;
        state.status = 'pending';
      })
      .addCase(fetchMessageOfConversation.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.isLoading = false;
        state.status = 'idle';
      })
      .addCase(fetchMessageOfConversation.rejected, (state) => {
        state.isLoading = false;
        state.status = 'failed';
      });
  },
});

export const { createNewMessage, deleteMessage } = messageSlice.actions;
export default messageSlice.reducer;
export const selectMessage = (state: RootState) => state.message;
