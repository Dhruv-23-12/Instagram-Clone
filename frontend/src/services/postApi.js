import apiClient from './apiClient.js';

export const postApi = {
  // Get all posts (feed)
  getPosts: async (page = 1, limit = 10, filter = 'all') => {
    const response = await apiClient.get('/posts', {
      params: { page, limit, filter }
    });
    return response.data;
  },

  // Get single post
  getPost: async (postId) => {
    const response = await apiClient.get(`/posts/${postId}`);
    return response.data;
  },

  // Create new post
  createPost: async (postData) => {
    const response = await apiClient.post('/posts', postData);
    return response.data;
  },

  // Update post
  updatePost: async (postId, postData) => {
    const response = await apiClient.put(`/posts/${postId}`, postData);
    return response.data;
  },

  // Delete post
  deletePost: async (postId) => {
    const response = await apiClient.delete(`/posts/${postId}`);
    return response.data;
  },

  // Like/Unlike post
  toggleLike: async (postId) => {
    const response = await apiClient.post(`/posts/${postId}/like`);
    return response.data;
  },

  // Get post comments
  getComments: async (postId, page = 1, limit = 20) => {
    const response = await apiClient.get(`/posts/${postId}/comments`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Add comment to post
  addComment: async (postId, content) => {
    const response = await apiClient.post(`/posts/${postId}/comments`, { content });
    return response.data;
  },

  // Update comment
  updateComment: async (postId, commentId, content) => {
    const response = await apiClient.put(`/posts/${postId}/comments/${commentId}`, { content });
    return response.data;
  },

  // Delete comment
  deleteComment: async (postId, commentId) => {
    const response = await apiClient.delete(`/posts/${postId}/comments/${commentId}`);
    return response.data;
  },

  // Like/Unlike comment
  toggleCommentLike: async (postId, commentId) => {
    const response = await apiClient.post(`/posts/${postId}/comments/${commentId}/like`);
    return response.data;
  },

  // Share post
  sharePost: async (postId) => {
    const response = await apiClient.post(`/posts/${postId}/share`);
    return response.data;
  },

  // Bookmark post
  bookmarkPost: async (postId) => {
    const response = await apiClient.post(`/posts/${postId}/bookmark`);
    return response.data;
  },

  // Remove bookmark
  removeBookmark: async (postId) => {
    const response = await apiClient.delete(`/posts/${postId}/bookmark`);
    return response.data;
  },

  // Get bookmarked posts
  getBookmarkedPosts: async (page = 1, limit = 10) => {
    const response = await apiClient.get('/posts/bookmarked', {
      params: { page, limit }
    });
    return response.data;
  },

  // Get user's posts
  getUserPosts: async (userId, page = 1, limit = 10) => {
    const response = await apiClient.get(`/users/${userId}/posts`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Report post
  reportPost: async (postId, reason) => {
    const response = await apiClient.post(`/posts/${postId}/report`, { reason });
    return response.data;
  },

  // Get trending posts
  getTrendingPosts: async (page = 1, limit = 10) => {
    const response = await apiClient.get('/posts/trending', {
      params: { page, limit }
    });
    return response.data;
  },

  // Get posts by hashtag
  getPostsByHashtag: async (hashtag, page = 1, limit = 10) => {
    const response = await apiClient.get(`/posts/hashtag/${hashtag}`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Upload media
  uploadMedia: async (file) => {
    const formData = new FormData();
    formData.append('media', file);
    
    const response = await apiClient.post('/posts/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};