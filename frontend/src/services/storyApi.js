import apiClient from './apiClient.js';

export const storyApi = {
  // Create story
  createStory: async (storyData) => {
    const response = await apiClient.post('/stories', storyData);
    return response.data;
  },

  // Get stories feed
  getStoriesFeed: async (page = 1, limit = 20) => {
    const response = await apiClient.get(`/stories/feed?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get user's stories
  getUserStories: async (userId) => {
    const response = await apiClient.get(`/stories/user/${userId}`);
    return response.data;
  },

  // View story
  viewStory: async (storyId) => {
    const response = await apiClient.post(`/stories/${storyId}/view`);
    return response.data;
  },

  // Get story viewers
  getStoryViewers: async (storyId) => {
    const response = await apiClient.get(`/stories/${storyId}/viewers`);
    return response.data;
  },

  // Delete story
  deleteStory: async (storyId) => {
    const response = await apiClient.delete(`/stories/${storyId}`);
    return response.data;
  }
};
