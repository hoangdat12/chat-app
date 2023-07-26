import { RootState } from '../../app/store';
import {
  IComment,
  IDataCreateComment,
  IDataGetListComment,
} from '../../ultils/interface';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { commentService } from './commentService';

export interface IInitialStateComment {
  comments: IComment[] | null;
  parentComment: IComment | null;
  isLoading: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const initialState: IInitialStateComment = {
  comments: null,
  parentComment: null,
  isLoading: false,
  status: 'idle',
};

const createComment = createAsyncThunk(
  'comment/create',
  async (data: IDataCreateComment) => {
    return commentService.createComment(data);
  }
);

const getListComment = createAsyncThunk(
  'comment/get',
  async (data: IDataGetListComment) => {
    return commentService.getListComment(data);
  }
);

const commentSlice = createSlice({
  name: 'comment',
  initialState: initialState,
  reducers: {
    getMoreComment: (state, action: PayloadAction<IComment[]>) => {
      state.comments = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createComment.pending, (state) => {
        state.status = 'pending';
        state.isLoading = true;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.status = 'idle';
        state.isLoading = false;
        const comment = action.payload.data.metaData;
        if (state.comments) {
          state.comments = [comment, ...state.comments];
        } else {
          state.comments = [comment];
        }
      })
      .addCase(createComment.rejected, (state) => {
        state.status = 'failed';
        state.isLoading = false;
      })

      .addCase(getListComment.pending, (state) => {
        state.status = 'pending';
        state.isLoading = true;
      })
      .addCase(getListComment.fulfilled, (state, action) => {
        state.status = 'idle';
        state.isLoading = false;
        const { parentComment, comments } = action.payload.data.metaData;
        state.parentComment = parentComment;
        state.comments = comments;
      })
      .addCase(getListComment.rejected, (state) => {
        state.status = 'failed';
        state.isLoading = false;
      });
  },
});

export const { getMoreComment } = commentSlice.actions;
export default commentSlice.reducer;
export const selectComment = (state: RootState) => state.comment;
