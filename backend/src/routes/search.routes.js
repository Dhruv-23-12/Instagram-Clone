import express from 'express';
import { authRequired } from '../middleware/auth.js';
import { generalLimiter } from '../middleware/rateLimiter.js';
import User from '../models/User.js';
import Post from '../models/Post.js';

const router = express.Router();

// Search all content
router.get('/', authRequired, generalLimiter, async (req, res) => {
  try {
    const { q, type, sort, limit = 20, offset = 0 } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const results = {
      users: [],
      posts: [],
      hashtags: [],
      events: [],
      total: 0
    };

    // Search users
    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { bio: { $regex: q, $options: 'i' } }
      ]
    })
    .select('name email role department bio avatarUrl followersCount followingCount isVerified')
    .limit(5)
    .sort({ followersCount: -1 });

    results.users = users;

    // Search posts
    const posts = await Post.find({
      $or: [
        { content: { $regex: q, $options: 'i' } },
        { caption: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ],
      isPublic: true
    })
    .populate('author', 'name avatarUrl isVerified role')
    .select('content caption media likesCount commentsCount sharesCount createdAt tags')
    .limit(5)
    .sort({ createdAt: -1 });

    results.posts = posts;

    // Search hashtags
    const hashtagPosts = await Post.find({
      tags: { $in: [new RegExp(q, 'i')] },
      isPublic: true
    })
    .select('tags')
    .limit(10);

    const hashtagCounts = {};
    hashtagPosts.forEach(post => {
      post.tags.forEach(tag => {
        if (tag.toLowerCase().includes(q.toLowerCase())) {
          hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
        }
      });
    });

    results.hashtags = Object.entries(hashtagCounts)
      .map(([name, postsCount]) => ({
        name,
        postsCount,
        isTrending: postsCount > 10,
        lastUsed: new Date()
      }))
      .sort((a, b) => b.postsCount - a.postsCount)
      .slice(0, 5);

    results.total = users.length + posts.length + results.hashtags.length;

    res.json({
      success: true,
      results: results,
      query: q,
      filters: { type, sort, limit, offset }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
});

// Search users
router.get('/users', authRequired, generalLimiter, async (req, res) => {
  try {
    const { q, department, role, limit = 20, offset = 0 } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Build search query
    const searchQuery = {
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { bio: { $regex: q, $options: 'i' } }
      ]
    };

    // Add filters
    if (department) {
      searchQuery.department = { $regex: department, $options: 'i' };
    }
    if (role) {
      searchQuery.role = role;
    }

    const users = await User.find(searchQuery)
      .select('name email role department bio avatarUrl followersCount followingCount isVerified')
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .sort({ followersCount: -1 });

    const total = await User.countDocuments(searchQuery);

    res.json({
      success: true,
      data: users,
      total: total,
      query: q
    });
  } catch (error) {
    console.error('User search error:', error);
    res.status(500).json({ message: 'User search failed', error: error.message });
  }
});

// Search posts
router.get('/posts', authRequired, generalLimiter, async (req, res) => {
  try {
    const { q, author, hashtag, limit = 20, offset = 0 } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Build search query
    const searchQuery = {
      $or: [
        { content: { $regex: q, $options: 'i' } },
        { caption: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ],
      isPublic: true
    };

    // Add filters
    if (author) {
      const authorUser = await User.findOne({ name: { $regex: author, $options: 'i' } });
      if (authorUser) {
        searchQuery.author = authorUser._id;
      }
    }
    if (hashtag) {
      searchQuery.tags = { $in: [new RegExp(hashtag, 'i')] };
    }

    const posts = await Post.find(searchQuery)
      .populate('author', 'name avatarUrl isVerified role')
      .select('content caption media likesCount commentsCount sharesCount createdAt tags')
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .sort({ createdAt: -1 });

    const total = await Post.countDocuments(searchQuery);

    res.json({
      success: true,
      data: posts,
      total: total,
      query: q
    });
  } catch (error) {
    console.error('Post search error:', error);
    res.status(500).json({ message: 'Post search failed', error: error.message });
  }
});

// Search hashtags
router.get('/hashtags', authRequired, generalLimiter, async (req, res) => {
  try {
    const { q, limit = 20, offset = 0 } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Search for posts with matching hashtags
    const posts = await Post.find({
      tags: { $in: [new RegExp(q, 'i')] },
      isPublic: true
    })
    .select('tags')
    .limit(parseInt(limit) * 2); // Get more to aggregate

    // Aggregate hashtags
    const hashtagCounts = {};
    posts.forEach(post => {
      post.tags.forEach(tag => {
        if (tag.toLowerCase().includes(q.toLowerCase())) {
          hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
        }
      });
    });

    // Convert to array and sort by count
    const hashtags = Object.entries(hashtagCounts)
      .map(([name, postsCount]) => ({
        name,
        postsCount,
        isTrending: postsCount > 10,
        lastUsed: new Date()
      }))
      .sort((a, b) => b.postsCount - a.postsCount)
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      data: hashtags,
      total: hashtags.length,
      query: q
    });
  } catch (error) {
    console.error('Hashtag search error:', error);
    res.status(500).json({ message: 'Hashtag search failed', error: error.message });
  }
});

// Search events
router.get('/events', authRequired, generalLimiter, async (req, res) => {
  try {
    const { q, date, location, limit = 20, offset = 0 } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // For now, return empty results as events are not implemented yet
    res.json({
      success: true,
      data: [],
      total: 0,
      query: q
    });
  } catch (error) {
    console.error('Event search error:', error);
    res.status(500).json({ message: 'Event search failed', error: error.message });
  }
});

// Get search suggestions
router.get('/suggestions', authRequired, generalLimiter, async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.json({ success: true, data: [] });
    }

    const suggestions = [];

    // Search users
    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ]
    })
    .select('name role department')
    .limit(3);

    users.forEach(user => {
      suggestions.push({
        type: 'user',
        name: user.name,
        subtitle: `${user.role}${user.department ? ` • ${user.department}` : ''}`,
        avatar: null
      });
    });

    // Search hashtags
    const posts = await Post.find({
      tags: { $in: [new RegExp(q, 'i')] },
      isPublic: true
    })
    .select('tags')
    .limit(10);

    const hashtagCounts = {};
    posts.forEach(post => {
      post.tags.forEach(tag => {
        if (tag.toLowerCase().includes(q.toLowerCase())) {
          hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
        }
      });
    });

    Object.entries(hashtagCounts)
      .slice(0, 2)
      .forEach(([name, count]) => {
        suggestions.push({
          type: 'hashtag',
          name: name,
          subtitle: `${count} posts`,
          avatar: null
        });
      });

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({ message: 'Search suggestions failed', error: error.message });
  }
});

// Get trending topics
router.get('/trending', authRequired, async (req, res) => {
  try {
    // Get trending hashtags from posts
    const posts = await Post.find({ isPublic: true })
      .select('tags')
      .limit(100);

    const hashtagCounts = {};
    posts.forEach(post => {
      post.tags.forEach(tag => {
        hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
      });
    });

    const trending = Object.entries(hashtagCounts)
      .map(([name, postsCount]) => ({
        name,
        postsCount,
        growth: '+0%' // Placeholder for now
      }))
      .sort((a, b) => b.postsCount - a.postsCount)
      .slice(0, 10);

    res.json({
      success: true,
      data: trending
    });
  } catch (error) {
    console.error('Trending topics error:', error);
    res.status(500).json({ message: 'Trending topics failed', error: error.message });
  }
});

// Get recent searches
router.get('/recent', authRequired, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // For now, return empty array as search history is not implemented yet
    res.json({
      success: true,
      data: []
    });
  } catch (error) {
    console.error('Recent searches error:', error);
    res.status(500).json({ message: 'Recent searches failed', error: error.message });
  }
});

// Save search query
router.post('/save', authRequired, async (req, res) => {
  try {
    const { query } = req.body;
    const userId = req.user.id;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // For now, just return success as search history is not implemented yet
    res.json({
      success: true,
      message: 'Search query saved'
    });
  } catch (error) {
    console.error('Save search error:', error);
    res.status(500).json({ message: 'Save search failed', error: error.message });
  }
});

export default router;
