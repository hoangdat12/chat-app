import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { enableMapSet } from 'immer';

import authReducer from '../features/auth/authSlice';
import conversationReducer from '../features/conversation/conversationSlice';
import messageReducer from '../features/message/messageSlice';
import friendReducer from '../features/friend/friendSlice';
import notifyReducer from '../features/notify/notifySlice';
import postReducer from '../features/post/postSlice';
import callReducer from '../features/call/callSlice';
import showErrorReducer from '../features/showError';
// import commentReducer from '../features/comment/commentSlice';

enableMapSet();
export const store = configureStore({
  reducer: {
    auth: authReducer,
    conversation: conversationReducer,
    message: messageReducer,
    friend: friendReducer,
    notify: notifyReducer,
    post: postReducer,
    call: callReducer,
    // comment: commentReducer,
    showError: showErrorReducer,
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
