import express from 'express';
import { z } from 'zod';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import Follow from '../models/Follow.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

// Validation schemas
const createPostSchema = z.object({
  content: z.string().max(500).optional(),
  caption: z.string().max(500).optional(),
  media: z.array(z.object({
    type: z.enum(['image', 'video']),
    url: z.string().url(),
    thumbnail: z.string().url().optional(),
    duration: z.number().optional(),
    size: z.number().optional()
  })).optional(),
  location: z.string().max(200).optional(),
  hashtags: z.array(z.string().max(50)).optional(),
  mentions: z.array(z.string()).optional()
});

const commentSchema = z.object({
  content: z.string().min(1).max(500)
});

// Create post
router.post('/', authRequired, async (req, res) => {
  try {
    const parsed = createPostSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid input', errors: parsed.error.errors });
    }

    const { content, caption, media, location, hashtags, mentions } = parsed.data;

    // Determine post type based on content and media
    let postType = 'text';
    if (media && media.length > 0) {
      if (media.length === 1) {
        postType = media[0].type;
      } else {
        postType = 'carousel';
      }
    }

    const post = new Post({
      author: req.user._id,
      content: content || caption || '',
      caption: caption || content || '',
      media: media || [],
      postType,
      location: location || undefined,
      tags: hashtags || [],
      mentions: mentions || []
    });

    await post.save();
    await post.populate('author', 'name avatarUrl');

    // Update user's posts count
    await req.user.updateOne({ $inc: { postsCount: 1 } });

    res.status(201).json({ post });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error creating post.' });
  }
});

// Get all posts (public feed)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ isPublic: true })
      .populate('author', 'name avatarUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Transform posts to include id field for frontend compatibility
    const transformedPosts = posts.map(post => ({
      ...post,
      id: post._id,
      author: {
        ...post.author,
        id: post.author._id
      }
    }));

    res.json({ posts: transformedPosts });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Server error fetching posts.' });
  }
});

// Get following feed
router.get('/following', authRequired, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get users that current user follows
    const following = await Follow.find({ follower: req.user._id }).select('following');
    const followingIds = following.map(f => f.following);

    const posts = await Post.find({ 
      author: { $in: followingIds },
      isPublic: true 
    })
      .populate('author', 'name avatarUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({ posts });
  } catch (error) {
    console.error('Get following feed error:', error);
    res.status(500).json({ message: 'Server error fetching following feed.' });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name avatarUrl')
      .lean();

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ post });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Server error fetching post.' });
  }
});

// Like/Unlike post
router.post('/:id/like', authRequired, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user._id;
    const likedIndex = post.likes.indexOf(userId);

    if (likedIndex === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(likedIndex, 1);
    }

    await post.save();

    res.json({ 
      likesCount: post.likesCount, 
      liked: likedIndex === -1 
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: 'Server error liking post.' });
  }
});

// Add comment
router.post('/:id/comments', authRequired, async (req, res) => {
  try {
    const parsed = commentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid input', errors: parsed.error.errors });
    }

    const { content } = parsed.data;

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = new Comment({
      post: post._id,
      author: req.user._id,
      content
    });

    await comment.save();
    await comment.populate('author', 'name avatarUrl');

    // Update post comments count
    await post.updateOne({ $inc: { commentsCount: 1 } });

    res.status(201).json({ comment });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error adding comment.' });
  }
});

// Get comments
router.get('/:id/comments', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({ post: req.params.id })
      .populate('author', 'name avatarUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({ comments });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error fetching comments.' });
  }
});

// Delete post
router.delete('/:id', authRequired, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    // Delete all comments for this post
    await Comment.deleteMany({ post: post._id });

    // Delete the post
    await Post.findByIdAndDelete(req.params.id);

    // Update user's posts count
    await req.user.updateOne({ $inc: { postsCount: -1 } });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error deleting post.' });
  }
});

// Upload media
router.post('/upload', authRequired, async (req, res) => {
  try {
    // For now, we'll simulate a successful upload
    // In a real app, you'd use multer or similar to handle file uploads
    // and upload to cloud storage like AWS S3, Cloudinary, etc.
    
    // Generate a mock URL for the uploaded file
    const mockUrl = `https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Uploaded+Image+${Date.now()}`;
    
    res.json({ 
      url: mockUrl,
      message: 'Media uploaded successfully' 
    });
  } catch (error) {
    console.error('Upload media error:', error);
    res.status(500).json({ message: 'Server error uploading media.' });
  }
});

// Share post
router.post('/:id/share', authRequired, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment shares count
    await Post.findByIdAndUpdate(req.params.id, { $inc: { sharesCount: 1 } });

    res.json({ message: 'Post shared successfully' });
  } catch (error) {
    console.error('Share post error:', error);
    res.status(500).json({ message: 'Server error sharing post.' });
  }
});

// Bookmark post
router.post('/:id/bookmark', authRequired, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // For now, just return success
    // In a real app, you'd have a Bookmark model to track user bookmarks
    res.json({ message: 'Post bookmarked successfully' });
  } catch (error) {
    console.error('Bookmark post error:', error);
    res.status(500).json({ message: 'Server error bookmarking post.' });
  }
});

// Remove bookmark
router.delete('/:id/bookmark', authRequired, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // For now, just return success
    // In a real app, you'd have a Bookmark model to track user bookmarks
    res.json({ message: 'Bookmark removed successfully' });
  } catch (error) {
    console.error('Remove bookmark error:', error);
    res.status(500).json({ message: 'Server error removing bookmark.' });
  }
});

// Report post
router.post('/:id/report', authRequired, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const { reason } = req.body;
    
    // For now, just return success
    // In a real app, you'd have a Report model to track reports
    console.log(`Post ${req.params.id} reported by user ${req.user._id} for reason: ${reason}`);
    
    res.json({ message: 'Post reported successfully' });
  } catch (error) {
    console.error('Report post error:', error);
    res.status(500).json({ message: 'Server error reporting post.' });
  }
});

export default router;
