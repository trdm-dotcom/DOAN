import {createReducer} from '@reduxjs/toolkit';

const initialState: any = {
  totalMyPost: 0,
  posts: [],
  myPost: [],
  myPostHide: [],
  myPostTag: [],
  error: null,
  isLoading: true,
  nextPage: 0,
  totalPages: 0,
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
    state.posts = [...newPosts, ...state.posts];
  },
  addMyPost: (state, action) => {
    state.totalMyPost = action.payload.total;
    if (action.payload.page === 0) {
      state.myPost = action.payload.datas;
    } else {
      const newPosts = action.payload.filter(
        newPost => !state.myPost.some(post => post.id === newPost.id),
      );
      state.myPost = [...newPosts, ...state.myPost];
    }
  },
  addMyPostHide: (state, action) => {
    if (action.payload.page === 0) {
      state.myPostHide = action.payload.datas;
    } else {
      const newPosts = action.payload.filter(
        newPost => !state.myPostHide.some(post => post.id === newPost.id),
      );
      state.myPostHide = [...state.myPostHide, ...newPosts];
    }
  },
  addMyPostTag: (state, action) => {
    if (action.payload.page === 0) {
      state.myPostTag = action.payload.datas;
    } else {
      const newPosts = action.payload.filter(
        newPost => !state.myPostTag.some(post => post.id === newPost.id),
      );
      state.myPostTag = [...state.myPostTag, ...newPosts];
    }
  },
  addOneMyPost: (state, action) => {
    if (!state.myPost.some(post => post.id === action.payload.id)) {
      state.myPost = [...state.myPost, ...[action.payload]];
    }
  },
  addOneMyPostHide: (state, action) => {
    if (!state.myPostHide.some(post => post.id === action.payload.id)) {
      state.myPostHide = [...state.myPostHide, ...[action.payload]];
    }
  },
  removeMyPost: (state, action) => {
    state.myPost = state.myPost.filter(post => post.id !== action.payload.id);
  },
  removeMyPostHide: (state, action) => {
    state.myPostHide = state.myPostHide.filter(
      post => post.id !== action.payload.id,
    );
  },
  removePostByUserId: (state, action) => {
    state.posts = state.posts.filter(
      post => post.author.userId !== action.payload.id,
    );
  },
  incrementTotalMyPost: state => {
    state.totalMyPost++;
  },
  decrementTotalMyPost: state => {
    state.totalMyPost--;
  },
  clearErrors: state => {
    state.error = null;
  },
});
