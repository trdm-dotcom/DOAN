import {createReducer} from '@reduxjs/toolkit';

const initialState: any = {
  posts: [],
  myPost: [],
  myPostHide: [],
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
      const newPosts = action.payload.filter(
        newPost => !state.posts.some(post => post.id === newPost.id),
      );
      state.posts = [...state.posts, ...newPosts];
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
  addPost: (state, action) => {
    const newPosts = action.payload.filter(
      newPost => !state.posts.some(post => post.id === newPost.id),
    );
    state.posts = [...state.posts, ...newPosts];
  },
  addMyPost: (state, action) => {
    const newPosts = action.payload.filter(
      newPost => !state.myPost.some(post => post.id === newPost.id),
    );
    state.myPost = [...state.myPost, ...newPosts];
  },
  addMyPostHide: (state, action) => {
    const newPosts = action.payload.filter(
      newPost => !state.myPostHide.some(post => post.id === newPost.id),
    );
    state.myPostHide = [...state.myPostHide, ...newPosts];
  },
  removeMyPost: (state, action) => {
    state.myPost = state.myPost.filter(post => post.id !== action.payload.id);
  },
  removeMyPostHide: (state, action) => {
    state.myPostHide = state.myPostHide.filter(
      post => post.id !== action.payload.id,
    );
  },
  clearErrors: state => {
    state.error = null;
  },
});
