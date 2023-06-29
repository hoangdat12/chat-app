import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { conversationService } from './conversationService';
import {
  IConversation,
  IPayloadReadLastMessage,
  IPayloadUpdateLastMessage,
} from '../../ultils/interface';

export interface IInitialStateConversation {
  conversations: Map<string, IConversation>;
  isLoading: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const initialState: IInitialStateConversation = {
  conversations: new Map<string, IConversation>(),
  isLoading: false,
  status: 'idle',
};

export const fetchConversationOfUser = createAsyncThunk(
  'conversation/getAll',
  async (userId: string) => {
    return await conversationService.fetchConversationOfUser(userId);
  }
);

const conversationSlice = createSlice({
  name: 'conversation',
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
      action: PayloadAction<IPayloadUpdateLastMessage>
    ) => {
      const { conversationId } = action.payload;
      const firstKey = state.conversations.keys().next().value;
      if (conversationId) {
        const conversation = state.conversations.get(conversationId);
        if (firstKey === conversationId && conversation) {
          conversation.lastMessage = action.payload.lastMessage;
          return;
        }
        // Update lastMessage up conversation
        if (conversation) {
          conversation.lastMessage = action.payload.lastMessage;
          // Save with conversation is first
          const conversationUpdate = new Map([[conversationId, conversation]]);
          state.conversations.delete(conversationId);
          state.conversations = new Map([
            ...conversationUpdate,
            ...state.conversations,
          ]);
        }
      }
    },
    updateLastMessage: (
      state,
      action: PayloadAction<IPayloadUpdateLastMessage>
    ) => {
      const { conversationId, lastMessage } = action.payload;
      const conversationFound = state.conversations.get(conversationId ?? '');
      if (conversationFound) {
        if (!lastMessage) {
          if (conversationFound?.conversation_type === 'group') {
            conversationFound.lastMessage.message_content = '';
            return;
          } else {
            conversationFound.lastMessage.message_content = '';
          }
        } else {
          conversationFound.lastMessage = action.payload.lastMessage;
        }
      }
    },
    deleteLastMessage: (
      state,
      action: PayloadAction<IPayloadUpdateLastMessage>
    ) => {
      const { conversationId, lastMessage } = action.payload;
      const conversation = state.conversations.get(conversationId ?? '');
      if (conversation) {
        if (lastMessage !== undefined || lastMessage !== null) {
          conversation.lastMessage = lastMessage;
          return;
        } else {
          conversation.lastMessage.message_content = '';
          return;
        }
      }
    },
    readLastMessage: (
      state,
      action: PayloadAction<IPayloadReadLastMessage>
    ) => {
      const { user, conversationId } = action.payload;
      const conversation = state.conversations.get(conversationId ?? '');
      if (conversation) {
        for (let participant of conversation.participants) {
          if (participant.userId === user?._id) {
            participant.isReadLastMessage = true;
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversationOfUser.pending, (state) => {
        state.status = 'pending';
        state.isLoading = true;
      })
      .addCase(fetchConversationOfUser.fulfilled, (state, action) => {
        state.status = 'idle';
        state.isLoading = false;
        action.payload.conversations.map((conversation) =>
          state.conversations.set(conversation._id, conversation)
        );
      })
      .addCase(fetchConversationOfUser.rejected, (state) => {
        state.status = 'failed';
        state.isLoading = false;
      });
  },
});

export const {
  createConversation,
  createNewMessageOfConversation,
  updateLastMessage,
  deleteLastMessage,
  readLastMessage,
} = conversationSlice.actions;
export default conversationSlice.reducer;
export const selectConversation = (state: RootState) => state.conversation;
