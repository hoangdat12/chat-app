import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { messageService } from './messageService';
import {
  IDataFormatMessage,
  IDataGetMessageOfConversation,
  IMessage,
} from '../../ultils/interface';
import { getTimeSendMessage, getUserLocalStorageItem } from '../../ultils';

export interface IMessageInitialState {
  messages: IDataFormatMessage[];
  isLoading: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
}

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

const user = getUserLocalStorageItem();

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    createNewMessage: (state, action: PayloadAction<IMessage>) => {
      const firstMessage = state.messages[0].messages;
      const senderId = action.payload.message_sender_by.userId;

      // Check time send message compare to lastMessage less then 5 minus or not
      const condition =
        new Date(action.payload?.createdAt).getTime() -
          new Date(firstMessage[0]?.createdAt).getTime() <
        5 * 1000 * 60;

      if (condition && senderId === firstMessage[0].message_sender_by.userId)
        state.messages[0].messages = [action.payload, ...firstMessage];
      else {
        // Fortmat new Message
        const newMessage = {
          messages: [action.payload],
          user: action.payload?.message_sender_by,
          myMessage: senderId === user._id,
          timeSendMessage: !condition
            ? getTimeSendMessage(action.payload?.createdAt)
            : null,
        } as IDataFormatMessage;

        // Move to first
        state.messages = [newMessage, ...state.messages];
      }
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
