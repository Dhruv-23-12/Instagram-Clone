import express from 'express';
import { z } from 'zod';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Follow from '../models/Follow.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

// Validation schemas
const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  bio: z.string().max(150).optional(),
  avatarUrl: z.string().url().optional()
});


// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Validate user ID format
    if (!userId || userId === 'undefined' || userId === 'null') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    // Check if it's a valid MongoDB ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if current user is following this user (if authenticated)
    let isFollowing = false;
    let isCurrentUser = false;
    
    if (req.user && req.user._id.toString() === user._id.toString()) {
      isCurrentUser = true;
    } else if (req.user) {
      const follow = await Follow.findOne({
        follower: req.user._id,
        following: user._id
      });
      isFollowing = !!follow;
    }

    res.json({ 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'Student',
        department: user.department || 'General',
        phone: user.phone,
        location: user.location,
        website: user.website,
        bio: user.bio,
        avatar: user.avatarUrl,
        coverUrl: user.coverUrl,
        isVerified: user.isVerified || false,
        isFollowing,
        isCurrentUser,
        followersCount: user.followersCount || 0,
        followingCount: user.followingCount || 0,
        postsCount: user.postsCount || 0,
        joinedDate: user.createdAt || new Date(),
        socialLinks: user.socialLinks || {},
        achievements: user.achievements || [],
        interests: user.interests || []
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error fetching user profile.' });
  }
});

// Get user's posts
router.get('/:id/posts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ author: req.params.id, isPublic: true })
      .populate('author', 'name avatarUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({ posts });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ message: 'Server error fetching user posts.' });
  }
});

// Follow user
router.post('/:id/follow', authRequired, async (req, res) => {
  try {
    const targetUserId = req.params.id;
    
    if (targetUserId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    // Check if already following
    const existingFollow = await Follow.findOne({
      follower: req.user._id,
      following: targetUserId
    });

    if (existingFollow) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    // Create follow relationship
    const follow = new Follow({
      follower: req.user._id,
      following: targetUserId
    });

    await follow.save();

    // Update follower counts
    await User.findByIdAndUpdate(req.user._id, { $inc: { followingCount: 1 } });
    await User.findByIdAndUpdate(targetUserId, { $inc: { followersCount: 1 } });

    res.json({ message: 'Successfully followed user' });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({ message: 'Server error following user.' });
  }
});

// Unfollow user
router.delete('/:id/follow', authRequired, async (req, res) => {
  try {
    const targetUserId = req.params.id;

    // Check if following
    const follow = await Follow.findOne({
      follower: req.user._id,
      following: targetUserId
    });

    if (!follow) {
      return res.status(400).json({ message: 'Not following this user' });
    }

    // Remove follow relationship
    await Follow.findByIdAndDelete(follow._id);

    // Update follower counts
    await User.findByIdAndUpdate(req.user._id, { $inc: { followingCount: -1 } });
    await User.findByIdAndUpdate(targetUserId, { $inc: { followersCount: -1 } });

    res.json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({ message: 'Server error unfollowing user.' });
  }
});

// Get followers
router.get('/:id/followers', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const followers = await Follow.find({ following: req.params.id })
      .populate('follower', 'name avatarUrl bio followersCount followingCount')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const followersData = followers.map(f => ({
      id: f.follower._id,
      name: f.follower.name,
      avatarUrl: f.follower.avatarUrl,
      bio: f.follower.bio,
      followersCount: f.follower.followersCount,
      followingCount: f.follower.followingCount,
      followedAt: f.createdAt
    }));

    res.json({ followers: followersData });
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ message: 'Server error fetching followers.' });
  }
});

// Get following
router.get('/:id/following', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const following = await Follow.find({ follower: req.params.id })
      .populate('following', 'name avatarUrl bio followersCount followingCount')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const followingData = following.map(f => ({
      id: f.following._id,
      name: f.following.name,
      avatarUrl: f.following.avatarUrl,
      bio: f.following.bio,
      followersCount: f.following.followersCount,
      followingCount: f.following.followingCount,
      followedAt: f.createdAt
    }));

    res.json({ following: followingData });
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ message: 'Server error fetching following.' });
  }
});

// Update profile
router.put('/profile', authRequired, async (req, res) => {
  try {
    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid input', errors: parsed.error.errors });
    }

    const updates = parsed.data;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        followersCount: user.followersCount,
        followingCount: user.followingCount,
        postsCount: user.postsCount
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile.' });
  }
});

export default router;
