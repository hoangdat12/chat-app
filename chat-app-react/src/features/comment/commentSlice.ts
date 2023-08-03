// import { RootState } from '../../app/store';
// import {
//   IComment,
// } from '../../ultils/interface';
// import { PayloadAction, createSlice } from '@reduxjs/toolkit';

// export interface ICommentsFeed {
//   parrentComments: IComment;
//   childComments: IComment[] | null;
//   remainComment: number;
// }

// export interface IInitialStateComment {
//   comments: ICommentsFeed | null;
//   parentComment: IComment | null;
//   isLoading: boolean;
//   status: 'idle' | 'pending' | 'succeeded' | 'failed';
// }

// const initialState: IInitialStateComment = {
//   comments: null,
//   parentComment: null,
//   isLoading: false,
//   status: 'idle',
// };

// const commentSlice = createSlice({
//   name: 'comment',
//   initialState: initialState,
//   reducers: {
//     createComment: (state, action: PayloadAction<IComment>) => {
//       state.comments = [action.payload, ...state.comments]
//     },
//   },
//   // extraReducers: (builder) => {

//   // },
// });

// // export const { getMoreComment } = commentSlice.actions;
// export default commentSlice.reducer;
// export const selectComment = (state: RootState) => state.comment;
