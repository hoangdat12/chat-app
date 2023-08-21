import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { conversationService } from './conversationService';
import {
  IConversation,
  IDataAddNewMemberResponse,
  IDataChangeEmoji,
  IDataChangeUsernameOfConversation,
  IDataDeleteMember,
  IDataDeleteMemberResponse,
  IDataUserLeaveGroupResponse,
  IPayloadReadLastMessage,
  IPayloadUpdateLastMessage,
} from '../../ultils/interface';
import { MessageType } from '../../ultils/constant/message.constant';

export interface IInitialStateConversation {
  conversations: Map<string, IConversation>;
  isLoading: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  firstConversation: IConversation | null;
}

const initialState: IInitialStateConversation = {
  conversations: new Map<string, IConversation>(),
  isLoading: false,
  status: 'idle',
  firstConversation: null,
};

export const fetchConversationOfUser = createAsyncThunk(
  'conversation/getAll',
  async (userId: string) => {
    return await conversationService.fetchConversationOfUser(userId);
  }
);

export const getFirstConversation = createAsyncThunk(
  'conversation/getFirst',
  async () => {
    return await conversationService.getFirstConversation();
  }
);

export const changeUsernameOfConversation = createAsyncThunk(
  'conversation/changeUsername',
  async (data: IDataChangeUsernameOfConversation) => {
    return await conversationService.handleChangeUsername(data);
  }
);

export const changEmojiOfConversation = createAsyncThunk(
  'conversation/changeEmoji',
  async (data: IDataChangeEmoji) => {
    return await conversationService.handleChangeEmoji(data);
  }
);

export const changeAvatarOfGroup = createAsyncThunk(
  'conversation/changeAvatar',
  async (data: FormData) => {
    return await conversationService.handleChangeAvatarOfGroup(data);
  }
);

export const handlePromotedAdmin = createAsyncThunk(
  'conversation/promotedAdmin',
  async (data: IDataDeleteMember) => {
    const res = await conversationService.handlePromotedAdmin(data);
    return res;
  }
);

export const handleDeleteConversation = createAsyncThunk(
  'conversation/deleteConversation',
  async (conversationId: string) => {
    const res = await conversationService.handleDeleteConversation(
      conversationId
    );
    return res;
  }
);

const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    searchConversation: (state, action: PayloadAction<IConversation[]>) => {
      const newConversations = new Map<string, IConversation>();
      action.payload.map((conversation) =>
        newConversations.set(conversation._id, conversation)
      );
      state.conversations.clear();
      state.conversations = newConversations;
    },
    createConversation: (state, action: PayloadAction<IConversation>) => {
      const newConversationMap = new Map([
        [action.payload._id, action.payload],
      ]);
      state.conversations = new Map([
        ...newConversationMap,
        ...state.conversations,
      ]);
      state.firstConversation = action.payload;
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
          state.firstConversation = conversation;
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
          if (conversationFound?.conversation_type === MessageType.GROUP) {
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
    deleteMemberOfGroup: (
      state,
      action: PayloadAction<IDataDeleteMemberResponse>
    ) => {
      const { conversation } = action.payload;
      const conversationExist = state.conversations.get(conversation._id ?? '');
      if (conversationExist) {
        for (let participant of conversationExist.participants) {
          if (participant.userId === action.payload.participant.userId) {
            participant.enable = false;
            conversationExist.lastMessage = conversation.lastMessage;
            return;
          }
        }
      }
    },
    leaveGroup: (state, action: PayloadAction<IDataUserLeaveGroupResponse>) => {
      const { conversation } = action.payload;
      const conversationExist = state.conversations.get(conversation._id ?? '');
      if (conversationExist) {
        for (let participant of conversationExist.participants) {
          if (participant.userId === action.payload.user._id) {
            participant.enable = false;
            conversationExist.lastMessage = conversation.lastMessage;
            return;
          }
        }
      }
    },
    changeUsernameOfParticipant: (
      state,
      action: PayloadAction<IDataChangeUsernameOfConversation>
    ) => {
      const conversation = state.conversations.get(
        action.payload.conversationId
      );
      if (conversation) {
        for (let participant of conversation.participants) {
          if (
            participant.userId ===
            action.payload.newUsernameOfParticipant.userId
          ) {
            participant.userName =
              action.payload.newUsernameOfParticipant.userName;
            return;
          }
        }
      }
    },
    changeEmojiOfConversation: (
      state,
      action: PayloadAction<IConversation>
    ) => {
      const conversation = state.conversations.get(action.payload._id);
      if (conversation) {
        conversation.emoji = action.payload.emoji;
        conversation.lastMessage = action.payload.lastMessage;
      }
    },
    changeAvatarOfConversation: (
      state,
      action: PayloadAction<IConversation>
    ) => {
      const conversation = state.conversations.get(action.payload._id);
      if (conversation) {
        conversation.avatarUrl = action.payload.avatarUrl;
        conversation.lastMessage = action.payload.lastMessage;
      }
    },
    changeNameOfConversation: (state, action: PayloadAction<IConversation>) => {
      const conversation = state.conversations.get(action.payload._id);
      if (conversation) {
        conversation.nameGroup = action.payload.nameGroup;
        conversation.lastMessage = action.payload.lastMessage;
      }
    },
    updateAvatarOfGroup: (
      state,
      action: PayloadAction<{
        conversationId: string;
        avatarUrl: string;
      }>
    ) => {
      const foundConversation = state.conversations.get(
        action.payload.conversationId
      );
      if (foundConversation) {
        foundConversation.avatarUrl = action.payload.avatarUrl;
      }
    },
    createFakeConversation: (state, action: PayloadAction<IConversation>) => {
      state.conversations.set(action.payload._id, action.payload);
    },
    updateConversationIdOfFakeConversation: (
      state,
      action: PayloadAction<{
        fakeConversationId: string;
        newConversationId: string;
      }>
    ) => {
      const foundConversation = state.conversations.get(
        action.payload.fakeConversationId
      );
      if (foundConversation) {
        foundConversation._id = action.payload.newConversationId;
      }
    },
    addMemberToGroup: (
      state,
      action: PayloadAction<IDataAddNewMemberResponse>
    ) => {
      if (!action.payload.newMember.length) return;
      const { conversationId, newMember } = action.payload;
      const conversation = state.conversations.get(conversationId);
      if (conversation) {
        conversation.participants = [
          ...conversation.participants,
          ...newMember,
        ];
      }
    },
  },
  extraReducers: (builder) => {
    // Get last conversation
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
        state.firstConversation = action.payload.conversations[0];
      })
      .addCase(fetchConversationOfUser.rejected, (state) => {
        state.status = 'failed';
        state.isLoading = false;
      })

      // Get first Conversation
      .addCase(getFirstConversation.pending, (state) => {
        state.status = 'pending';
        state.isLoading = true;
      })
      .addCase(getFirstConversation.fulfilled, (state, action) => {
        state.status = 'idle';
        state.isLoading = false;
        state.firstConversation = action.payload;
      })
      .addCase(getFirstConversation.rejected, (state) => {
        state.status = 'failed';
        state.isLoading = false;
      })

      // Change username of participant in conversation
      .addCase(changeUsernameOfConversation.pending, (state) => {
        state.status = 'pending';
        state.isLoading = true;
      })
      .addCase(changeUsernameOfConversation.fulfilled, (state, action) => {
        state.status = 'idle';
        state.isLoading = false;
        const conversation = state.conversations.get(
          action.payload.conversationId
        );
        if (conversation) {
          for (let participant of conversation.participants) {
            if (
              participant.userId ===
              action.payload.newUsernameOfParticipant.userId
            ) {
              participant.userName =
                action.payload.newUsernameOfParticipant.userName;
              return;
            }
          }
        }
      })
      .addCase(changeUsernameOfConversation.rejected, (state) => {
        state.status = 'failed';
        state.isLoading = false;
      })

      // Change emoji of participant in conversation
      .addCase(changEmojiOfConversation.pending, (state) => {
        state.status = 'pending';
        state.isLoading = true;
      })
      .addCase(changEmojiOfConversation.fulfilled, (state, action) => {
        state.status = 'idle';
        state.isLoading = false;
        const conversation = state.conversations.get(action.payload._id);
        if (conversation) {
          conversation.emoji = action.payload.emoji;
          conversation.lastMessage = action.payload.lastMessage;
        }
      })
      .addCase(changEmojiOfConversation.rejected, (state) => {
        state.status = 'failed';
        state.isLoading = false;
      })

      // Change avatar of participant in conversation
      .addCase(changeAvatarOfGroup.pending, (state) => {
        state.status = 'pending';
        state.isLoading = true;
      })
      .addCase(changeAvatarOfGroup.fulfilled, (state, action) => {
        state.status = 'idle';
        state.isLoading = false;
        const conversation = state.conversations.get(
          action.payload.data.metaData._id
        );
        if (conversation) {
          conversation.avatarUrl = action.payload.data.metaData.avatarUrl;
          conversation.lastMessage = action.payload.data.metaData.lastMessage;
        }
      })
      .addCase(changeAvatarOfGroup.rejected, (state) => {
        state.status = 'failed';
        state.isLoading = false;
      })

      // Promoted participant
      .addCase(handlePromotedAdmin.pending, (state) => {
        state.status = 'pending';
        state.isLoading = true;
      })
      .addCase(handlePromotedAdmin.fulfilled, (state, action) => {
        state.status = 'idle';
        state.isLoading = false;
        const conversation = state.conversations.get(
          action.payload.conversation._id
        );
        if (conversation?.creators) {
          conversation.creators = [
            ...conversation.creators,
            action.payload.participant,
          ];
        }
      })
      .addCase(handlePromotedAdmin.rejected, (state) => {
        state.status = 'failed';
        state.isLoading = false;
      })

      // Delete conversation
      .addCase(handleDeleteConversation.pending, (state) => {
        state.status = 'pending';
        state.isLoading = true;
      })
      .addCase(handleDeleteConversation.fulfilled, (state, action) => {
        state.status = 'idle';
        state.isLoading = false;
        state.conversations.delete(action.payload._id);
      })
      .addCase(handleDeleteConversation.rejected, (state) => {
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
  searchConversation,
  deleteMemberOfGroup,
  leaveGroup,
  changeUsernameOfParticipant,
  changeEmojiOfConversation,
  changeAvatarOfConversation,
  changeNameOfConversation,
  updateAvatarOfGroup,
  createFakeConversation,
  updateConversationIdOfFakeConversation,
  addMemberToGroup,
} = conversationSlice.actions;
export default conversationSlice.reducer;
export const selectConversation = (state: RootState) => state.conversation;
