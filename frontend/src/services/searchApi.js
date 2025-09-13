import apiClient from './apiClient.js';

const searchApi = {
  // Search all content
  searchAll: async (query, filters = {}) => {
    try {
      const response = await apiClient.get('/search', {
        params: { q: query, ...filters }
      });
      return response.data;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  },

  // Search users
  searchUsers: async (query, filters = {}) => {
    try {
      const response = await apiClient.get('/search/users', {
        params: { q: query, ...filters }
      });
      return response.data;
    } catch (error) {
      console.error('User search error:', error);
      throw error;
    }
  },

  // Search posts
  searchPosts: async (query, filters = {}) => {
    try {
      const response = await apiClient.get('/search/posts', {
        params: { q: query, ...filters }
      });
      return response.data;
    } catch (error) {
      console.error('Post search error:', error);
      throw error;
    }
  },

  // Search hashtags
  searchHashtags: async (query, filters = {}) => {
    try {
      const response = await apiClient.get('/search/hashtags', {
        params: { q: query, ...filters }
      });
      return response.data;
    } catch (error) {
      console.error('Hashtag search error:', error);
      throw error;
    }
  },

  // Search events
  searchEvents: async (query, filters = {}) => {
    try {
      const response = await apiClient.get('/search/events', {
        params: { q: query, ...filters }
      });
      return response.data;
    } catch (error) {
      console.error('Event search error:', error);
      throw error;
    }
  },

  // Get search suggestions
  getSuggestions: async (query) => {
    try {
      const response = await apiClient.get('/search/suggestions', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Search suggestions error:', error);
      throw error;
    }
  },

  // Get trending topics
  getTrending: async () => {
    try {
      const response = await apiClient.get('/search/trending');
      return response.data;
    } catch (error) {
      console.error('Trending topics error:', error);
      throw error;
    }
  },

  // Get recent searches
  getRecentSearches: async () => {
    try {
      const response = await apiClient.get('/search/recent');
      return response.data;
    } catch (error) {
      console.error('Recent searches error:', error);
      throw error;
    }
  },

  // Save search query
  saveSearch: async (query) => {
    try {
      const response = await apiClient.post('/search/save', { query });
      return response.data;
    } catch (error) {
      console.error('Save search error:', error);
      throw error;
    }
  }
};

export default searchApi;
