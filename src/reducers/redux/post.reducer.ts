import {createReducer} from '@reduxjs/toolkit';

const initialState: any = {
  posts: [],
  error: null,
  isLoading: true,
};

export const postReducer = createReducer(initialState, {
  getAllPostsRequest: state => {
    state.error = null;
    state.isLoading = true;
  },
  getAllPostsSuccess: (state, action) => {
    state.isLoading = false;
    state.nextPage = action.payload.page + 1;
    state.totalPages = action.payload.totalPages;
    if (action.payload.page === 0) {
      state.posts = action.payload.datas;
    } else {
      state.posts = [...state.posts, ...action.payload.datas];
    }
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
  deletePostsComments: (state, action) => {
    const existingIndex = state.posts.findIndex(
      post => post.id === action.payload.to,
    );
    if (existingIndex !== -1) {
      state.posts[existingIndex].comments = state.posts[
        existingIndex
      ].comments.filter(comment => comment.id !== action.payload.data.id);
    }
  },
  deleteOrDisablePost: (state, action) => {
    state.posts = state.posts.filter(
      post => post.id !== action.payload.data.id,
    );
  },
  clearErrors: state => {
    state.error = null;
  },
});
