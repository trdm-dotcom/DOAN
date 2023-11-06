import {createReducer} from '@reduxjs/toolkit';

const initialState: any = {
  posts: [],
  error: null,
  isLoading: true,
};

export const postReducer = createReducer(initialState, {
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
  updatePostsReactions: (state, action) => {
    const existingIndex = state.posts.findIndex(
      post => post.id === action.payload.to,
    );
    if (existingIndex !== -1) {
      state.posts[existingIndex].reactions.push(action.payload.data.reactions);
    }
  },
  updatePostsComments: (state, action) => {
    const existingIndex = state.posts.findIndex(
      post => post.id === action.payload.to,
    );
    if (existingIndex !== -1) {
      state.posts[existingIndex].comments.push(action.payload.data.comments);
    }
  },
  clearErrors: state => {
    state.error = null;
  },
});
