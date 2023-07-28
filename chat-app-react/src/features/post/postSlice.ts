import { RootState } from '../../app/store';
import {
  IDataChangePostMode,
  IDataLikePost,
  IPost,
} from '../../ultils/interface';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { postService } from './postService';

export interface IInitialStatePost {
  save: IPost[];
  posts: IPost[];
  isLoading: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const initialState: IInitialStatePost = {
  save: [],
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

export const changePostMode = createAsyncThunk(
  'post/changeMode',
  async (data: IDataChangePostMode) => {
    return await postService.changePostMode(data);
  }
);

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    getPost: (state, action: PayloadAction<IPost[]>) => {
      state.posts = [...state.posts, ...action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
        state.status = 'pending';
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = 'idle';
        state.posts = [action.payload.data.metaData, ...state.posts];
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
      })

      .addCase(changePostMode.pending, (state) => {
        state.isLoading = true;
        state.status = 'pending';
      })
      .addCase(changePostMode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = 'idle';
        for (let post of state.posts) {
          if (post._id === action.payload.data.metaData._id) {
            post.post_mode = action.payload.data.metaData.post_mode;
            return;
          }
        }
      })
      .addCase(changePostMode.rejected, (state) => {
        state.isLoading = false;
        state.status = 'failed';
      });
  },
});

export const { getPost } = postSlice.actions;
export default postSlice.reducer;
export const selectPost = (state: RootState) => state.post;