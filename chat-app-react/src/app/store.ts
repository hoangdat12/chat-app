import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { enableMapSet } from 'immer';

import authReducer from '../features/auth/authSlice';
import conversationReducer from '../features/conversation/conversationSlice';
import messageReducer from '../features/message/messageSlice';
import friendReducer from '../features/friend/friendSlice';
import notifyReducer from '../features/notify/notifySlice';
import postReducer from '../features/post/postSlice';

enableMapSet();
export const store = configureStore({
  reducer: {
    auth: authReducer,
    conversation: conversationReducer,
    message: messageReducer,
    friend: friendReducer,
    notify: notifyReducer,
    post: postReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
