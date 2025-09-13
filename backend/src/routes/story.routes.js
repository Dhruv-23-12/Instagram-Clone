import express from 'express';
import { z } from 'zod';
import Story from '../models/Story.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

// Validation schemas
const createStorySchema = z.object({
  content: z.string().min(1).max(500),
  imageUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  type: z.enum(['text', 'image', 'video']).default('text')
});

// Create story
router.post('/', authRequired, async (req, res) => {
  try {
    const parsed = createStorySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid input', errors: parsed.error.errors });
    }

    const { content, imageUrl, videoUrl, type } = parsed.data;

    // Validate that image or video is provided for respective types
    if (type === 'image' && !imageUrl) {
      return res.status(400).json({ message: 'Image URL is required for image stories' });
    }
    if (type === 'video' && !videoUrl) {
      return res.status(400).json({ message: 'Video URL is required for video stories' });
    }

    // Create story with 24-hour expiration
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    const story = new Story({
      author: req.user._id,
      content,
      imageUrl,
      videoUrl,
      type,
      expiresAt
    });

    await story.save();
    await story.populate('author', 'name avatarUrl');

    res.status(201).json({ story });
  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json({ message: 'Server error creating story.' });
  }
});

// Get stories feed (stories from followed users)
router.get('/feed', authRequired, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Get users that current user follows
    const Follow = (await import('../models/Follow.js')).default;
    const following = await Follow.find({ follower: req.user._id }).select('following');
    const followingIds = following.map(f => f.following);

    // Include current user's own stories
    followingIds.push(req.user._id);

    const stories = await Story.find({
      author: { $in: followingIds },
      isActive: true,
      expiresAt: { $gt: new Date() }
    })
      .populate('author', 'name avatarUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Group stories by author
    const storiesByAuthor = {};
    stories.forEach(story => {
      const authorId = story.author._id.toString();
      if (!storiesByAuthor[authorId]) {
        storiesByAuthor[authorId] = {
          author: story.author,
          stories: []
        };
      }
      storiesByAuthor[authorId].stories.push(story);
    });

    res.json({ storiesByAuthor: Object.values(storiesByAuthor) });
  } catch (error) {
    console.error('Get stories feed error:', error);
    res.status(500).json({ message: 'Server error fetching stories feed.' });
  }
});

// Get user's stories
router.get('/user/:userId', async (req, res) => {
  try {
    const stories = await Story.find({
      author: req.params.userId,
      isActive: true,
      expiresAt: { $gt: new Date() }
    })
      .populate('author', 'name avatarUrl')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ stories });
  } catch (error) {
    console.error('Get user stories error:', error);
    res.status(500).json({ message: 'Server error fetching user stories.' });
  }
});

// View story (mark as viewed)
router.post('/:id/view', authRequired, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Check if already viewed
    if (!story.views.includes(req.user._id)) {
      story.views.push(req.user._id);
      await story.save();
    }

    res.json({ message: 'Story viewed successfully' });
  } catch (error) {
    console.error('View story error:', error);
    res.status(500).json({ message: 'Server error viewing story.' });
  }
});

// Get story viewers
router.get('/:id/viewers', authRequired, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id)
      .populate('views', 'name avatarUrl')
      .select('views viewsCount');

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Check if user is the author
    if (story.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view story viewers' });
    }

    res.json({ viewers: story.views, viewsCount: story.viewsCount });
  } catch (error) {
    console.error('Get story viewers error:', error);
    res.status(500).json({ message: 'Server error fetching story viewers.' });
  }
});

// Delete story
router.delete('/:id', authRequired, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Check if user is the author
    if (story.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this story' });
    }

    story.isActive = false;
    await story.save();

    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Delete story error:', error);
    res.status(500).json({ message: 'Server error deleting story.' });
  }
});

export default router;
