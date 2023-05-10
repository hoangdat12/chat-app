import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { conversationService } from "./conversationService";

export interface IParticipant {
  userId: string;
  email: string;
  avatarUrl: string;
  userName: string;
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
  conversations: Map<string, IConversation>;
  isLoading: boolean;
  status: "idle" | "pending" | "succeeded" | "failed";
}

export interface IDataUpdateLastMessage {
  conversation: IConversation;
  lastMessage: string;
  lastMessageSendAt: string;
}

const initialState: IInitialStateConversation = {
  conversations: new Map<string, IConversation>(),
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
      const newConversationMap = new Map([
        [action.payload._id, action.payload],
      ]);
      state.conversations = new Map([
        ...newConversationMap,
        ...state.conversations,
      ]);
    },
    createNewMessageOfConversation: (
      state,
      action: PayloadAction<IDataUpdateLastMessage>
    ) => {
      const firstKey = state.conversations.keys().next().value;
      const conversationId = action.payload.conversation._id;

      if (firstKey === conversationId) return;
      const conversation = state.conversations.get(conversationId);

      if (!conversation) return;

      // Update lastMessage up conversation
      conversation.lastMessage = action.payload.lastMessage;
      conversation.lastMessageSendAt = action.payload.lastMessageSendAt;
      // Save with conversation is first
      const conversationUpdate = new Map([[conversationId, conversation]]);
      state.conversations.delete(conversationId);
      state.conversations = new Map([
        ...conversationUpdate,
        ...state.conversations,
      ]);
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
        action.payload.conversations.map((conversation) =>
          state.conversations.set(conversation._id, conversation)
        );
      })
      .addCase(fetchConversationOfUser.rejected, (state) => {
        state.status = "failed";
        state.isLoading = false;
      });
  },
});

export const { createConversation, createNewMessageOfConversation } =
  conversationSlice.actions;
export default conversationSlice.reducer;
export const selectConversation = (state: RootState) => state.conversation;
