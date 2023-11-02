import {createReducer} from '@reduxjs/toolkit';

const initialState: any = {
  posts: [],
  post: {author: {}, reactions: [], comments: [], tags: []},
  error: null,
  isLoading: true,
};

export const postReducer = createReducer(initialState, {
  postCreateRequest: state => {
    state.isLoading = true;
  },
  postCreateSuccess: (state, action) => {
    state.isLoading = false;
    state.posts = [...state.posts, action.payload];
    state.isSuccess = true;
  },
  postCreateFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },
  getPostRequest: state => {
    state.post = {author: {}, reactions: [], comments: [], tags: []};
    state.isLoading = true;
  },
  getPostSuccess: (state, action) => {
    state.isLoading = false;
    state.post = action.payload;
  },
  getPostFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },
  getAllPostsRequest: state => {
    state.isLoading = true;
  },
  getAllPostsSuccess: (state, action) => {
    state.isLoading = false;
    state.posts = action.payload;
  },
  getAllPostsFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },
  updateReactionPost: (state, action) => {
    state.posts = state.posts.map((post: any) =>
      post.id === action.payload.to
        ? {
            ...post,
            reactions: [...post.reactions, ...action.payload.data.reactions],
          }
        : post,
    );
  },
  updateCommentPost: (state, action) => {
    state.posts = state.posts.map((post: any) =>
      post.id === action.payload.to
        ? {
            ...post,
            reactions: [...post.reactions, ...action.payload.data.comments],
          }
        : post,
    );
  },
  clearErrors: state => {
    state.error = null;
  },
});
