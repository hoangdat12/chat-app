import { RootState } from '../../app/store';
import { IDataLikePost, IPost } from '../../ultils/interface';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postService } from './postService';

export interface IInitialStatePost {
  posts: IPost[];
  isLoading: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const initialState: IInitialStatePost = {
  posts: [],
  isLoading: false,
  status: 'idle',
};

export const createPost = createAsyncThunk(
  'post/create',
  async (data: FormData) => {
    return postService.createNewPost(data);
  }
);

export const getPostOfUser = createAsyncThunk(
  'post/get',
  async (userId: string) => {
    return postService.getPostOfUser(userId);
  }
);

export const likePost = createAsyncThunk(
  'post/like',
  async (data: IDataLikePost) => {
    return postService.likePost(data.postId, data.quantity);
  }
);

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
        state.status = 'pending';
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = 'idle';
        state.posts = [...state.posts, action.payload.data.metaData];
      })
      .addCase(createPost.rejected, (state) => {
        state.isLoading = false;
        state.status = 'failed';
      })

      .addCase(getPostOfUser.pending, (state) => {
        state.isLoading = true;
        state.status = 'pending';
      })
      .addCase(getPostOfUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = 'idle';
        state.posts = action.payload.data.metaData;
      })
      .addCase(getPostOfUser.rejected, (state) => {
        state.isLoading = false;
        state.status = 'failed';
      })

      .addCase(likePost.pending, (state) => {
        state.isLoading = true;
        state.status = 'pending';
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = 'idle';
        for (let post of state.posts) {
          if (post._id === action.payload.data.metaData._id) {
            post = action.payload.data.metaData;
            return;
          }
        }
      })
      .addCase(likePost.rejected, (state) => {
        state.isLoading = false;
        state.status = 'failed';
      });
  },
});

export const {} = postSlice.actions;
export default postSlice.reducer;
export const selectPost = (state: RootState) => state.post;
