import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
  currentPost: null,
  isLoading: false,
  error: null,
  hasMore: true,
  page: 1
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
      state.page = 1;
      state.hasMore = action.payload.length > 0;
    },
    addPosts: (state, action) => {
      state.posts = [...state.posts, ...action.payload];
      state.hasMore = action.payload.length > 0;
    },
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
    updatePost: (state, action) => {
      const updatedPost = action.payload;
      const index = state.posts.findIndex(post => post._id === updatedPost._id);
      if (index !== -1) {
        state.posts[index] = updatedPost;
      }
      if (state.currentPost && state.currentPost._id === updatedPost._id) {
        state.currentPost = updatedPost;
      }
    },
    removePost: (state, action) => {
      state.posts = state.posts.filter(post => post._id !== action.payload);
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    incrementPage: (state) => {
      state.page += 1;
    },
    resetPosts: (state) => {
      state.posts = [];
      state.page = 1;
      state.hasMore = true;
    }
  }
});

export const { 
  setPosts, 
  addPosts, 
  setCurrentPost, 
  updatePost, 
  removePost, 
  setLoading, 
  setError, 
  clearError, 
  incrementPage, 
  resetPosts 
} = postSlice.actions;
export default postSlice.reducer;
