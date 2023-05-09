import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { conversationService } from "./conversationService";

export interface IParticipant {
  userId: string;
  email: string;
  avatarUrl: string;
  firstName: string;
  lastName: string;
  enable: boolean;
  isReadLastMessage: boolean;
}

// Group and Conversation
export interface IConversation {
  _id: string;
  conversation_type: string;
  participants: IParticipant[];
  lastMessage: string;
  lastMessageSendAt: string;
  nameGroup: string;
  updatedAt: string;
  userId: string[];
  collection: string;
}

export interface IInitialStateConversation {
  conversations: IConversation[];
  isLoading: boolean;
  status: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: IInitialStateConversation = {
  conversations: [],
  isLoading: false,
  status: "idle",
};

export const fetchConversationOfUser = createAsyncThunk(
  "conversation/getAll",
  async (userId: string) => {
    return await conversationService.fetchConversationOfUser(userId);
  }
);

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    createConversation: (state, action: PayloadAction<IConversation>) => {
      state.conversations = [action.payload, ...state.conversations];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversationOfUser.pending, (state) => {
        state.status = "pending";
        state.isLoading = true;
      })
      .addCase(fetchConversationOfUser.fulfilled, (state, action) => {
        state.status = "idle";
        state.isLoading = false;
        state.conversations = action.payload.conversations;
      })
      .addCase(fetchConversationOfUser.rejected, (state) => {
        state.status = "failed";
        state.isLoading = false;
      });
  },
});

export const { createConversation } = conversationSlice.actions;
export default conversationSlice.reducer;
export const selectConversation = (state: RootState) => state.conversation;
