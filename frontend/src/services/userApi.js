import apiClient from './apiClient.js';

export const userApi = {
  // Get user profile
  getUser: async (userId) => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await apiClient.put('/users/profile', profileData);
    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await apiClient.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload cover photo
  uploadCover: async (file) => {
    const formData = new FormData();
    formData.append('cover', file);
    
    const response = await apiClient.post('/users/cover', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Follow user
  followUser: async (userId) => {
    const response = await apiClient.post(`/users/${userId}/follow`);
    return response.data;
  },

  // Unfollow user
  unfollowUser: async (userId) => {
    const response = await apiClient.delete(`/users/${userId}/follow`);
    return response.data;
  },

  // Get followers
  getFollowers: async (userId, page = 1, limit = 20) => {
    const response = await apiClient.get(`/users/${userId}/followers`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Get following
  getFollowing: async (userId, page = 1, limit = 20) => {
    const response = await apiClient.get(`/users/${userId}/following`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Get user posts
  getUserPosts: async (userId, page = 1, limit = 10) => {
    const response = await apiClient.get(`/users/${userId}/posts`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Get user media
  getUserMedia: async (userId, page = 1, limit = 20) => {
    const response = await apiClient.get(`/users/${userId}/media`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Get user likes
  getUserLikes: async (userId, page = 1, limit = 20) => {
    const response = await apiClient.get(`/users/${userId}/likes`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Search users
  searchUsers: async (query, page = 1, limit = 20) => {
    const response = await apiClient.get('/users/search', {
      params: { q: query, page, limit }
    });
    return response.data;
  },

  // Get suggested users
  getSuggestedUsers: async (limit = 10) => {
    const response = await apiClient.get('/users/suggested', {
      params: { limit }
    });
    return response.data;
  },

  // Block user
  blockUser: async (userId) => {
    const response = await apiClient.post(`/users/${userId}/block`);
    return response.data;
  },

  // Unblock user
  unblockUser: async (userId) => {
    const response = await apiClient.delete(`/users/${userId}/block`);
    return response.data;
  },

  // Get blocked users
  getBlockedUsers: async (page = 1, limit = 20) => {
    const response = await apiClient.get('/users/blocked', {
      params: { page, limit }
    });
    return response.data;
  },

  // Update privacy settings
  updatePrivacySettings: async (settings) => {
    const response = await apiClient.put('/users/privacy', settings);
    return response.data;
  },

  // Update notification settings
  updateNotificationSettings: async (settings) => {
    const response = await apiClient.put('/users/notifications', settings);
    return response.data;
  },

  // Get user analytics
  getUserAnalytics: async (userId, period = '30d') => {
    const response = await apiClient.get(`/users/${userId}/analytics`, {
      params: { period }
    });
    return response.data;
  }
};