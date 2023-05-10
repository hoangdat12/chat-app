import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IParticipant } from "../conversation/conversationSlice";
import { RootState } from "../../app/store";
import { messageService } from "./messageService";

export interface IDataGetMessageOfConversation {
  conversation_type: string;
  conversationId: string;
}

export interface IMessage {
  _id: string;
  message_content: string;
  message_conversation: string;
  message_received: IParticipant[];
  message_sender_by: IParticipant;
  message_type: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAllMessageData {
  messages: IMessage[];
  limit: number;
  page: number;
  sortedBy: string;
}

export interface IMessageInitialState {
  messages: IMessage[];
  isLoading: boolean;
  status: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: IMessageInitialState = {
  messages: [],
  isLoading: false,
  status: "idle",
};

export const fetchMessageOfConversation = createAsyncThunk(
  "message/get",
  async (data: IDataGetMessageOfConversation) => {
    return await messageService.fetchMessageOfConversation(
      data.conversation_type,
      data.conversationId
    );
  }
);

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    createNewMessage: (state, action: PayloadAction<IMessage>) => {
      state.messages = [action.payload, ...state.messages];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessageOfConversation.pending, (state) => {
        state.isLoading = true;
        state.status = "pending";
      })
      .addCase(fetchMessageOfConversation.fulfilled, (state, action) => {
        state.messages = action.payload.messages;
        state.isLoading = false;
        state.status = "idle";
      })
      .addCase(fetchMessageOfConversation.rejected, (state) => {
        state.isLoading = false;
        state.status = "failed";
      });
  },
});

export const { createNewMessage } = messageSlice.actions;
export default messageSlice.reducer;
export const selectMessage = (state: RootState) => state.message;
