import express from 'express';
import { z } from 'zod';
import Announcement from '../models/Announcement.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

// Validation schemas
const createAnnouncementSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(2000),
  category: z.enum(['academic', 'administrative', 'event', 'general', 'urgent']).default('general'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  targetAudience: z.enum(['all', 'students', 'faculty', 'staff', 'specific']).default('all'),
  targetGroups: z.array(z.string()).optional(),
  attachments: z.array(z.object({
    name: z.string(),
    url: z.string().url(),
    type: z.string()
  })).optional(),
  expiresAt: z.string().datetime().optional(),
  tags: z.array(z.string().max(50)).optional()
});

// Create announcement
router.post('/', authRequired, async (req, res) => {
  try {
    const parsed = createAnnouncementSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid input', errors: parsed.error.errors });
    }

    const announcementData = {
      ...parsed.data,
      author: req.user._id,
      ...(parsed.data.expiresAt && { expiresAt: new Date(parsed.data.expiresAt) })
    };

    const announcement = new Announcement(announcementData);
    await announcement.save();
    await announcement.populate('author', 'name avatarUrl');

    res.status(201).json({ announcement });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ message: 'Server error creating announcement.' });
  }
});

// Get announcements
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const priority = req.query.priority;
    const targetAudience = req.query.targetAudience;

    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (priority) {
      query.priority = priority;
    }
    
    if (targetAudience) {
      query.targetAudience = targetAudience;
    }

    const announcements = await Announcement.find(query)
      .populate('author', 'name avatarUrl')
      .sort({ priority: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({ announcements });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ message: 'Server error fetching announcements.' });
  }
});

// Get single announcement
router.get('/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('author', 'name avatarUrl')
      .lean();

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json({ announcement });
  } catch (error) {
    console.error('Get announcement error:', error);
    res.status(500).json({ message: 'Server error fetching announcement.' });
  }
});

// View announcement (track views)
router.post('/:id/view', authRequired, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    // Check if already viewed
    if (!announcement.views.includes(req.user._id)) {
      announcement.views.push(req.user._id);
      await announcement.save();
    }

    res.json({ message: 'Announcement viewed successfully' });
  } catch (error) {
    console.error('View announcement error:', error);
    res.status(500).json({ message: 'Server error viewing announcement.' });
  }
});

// Get user's announcements
router.get('/user/:userId', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const announcements = await Announcement.find({ author: req.params.userId })
      .populate('author', 'name avatarUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({ announcements });
  } catch (error) {
    console.error('Get user announcements error:', error);
    res.status(500).json({ message: 'Server error fetching user announcements.' });
  }
});

// Update announcement
router.put('/:id', authRequired, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    if (announcement.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this announcement' });
    }

    const parsed = createAnnouncementSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid input', errors: parsed.error.errors });
    }

    const updateData = { ...parsed.data };
    if (updateData.expiresAt) updateData.expiresAt = new Date(updateData.expiresAt);

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'name avatarUrl');

    res.json({ announcement: updatedAnnouncement });
  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({ message: 'Server error updating announcement.' });
  }
});

// Deactivate announcement
router.delete('/:id', authRequired, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    if (announcement.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this announcement' });
    }

    announcement.isActive = false;
    await announcement.save();

    res.json({ message: 'Announcement deactivated successfully' });
  } catch (error) {
    console.error('Deactivate announcement error:', error);
    res.status(500).json({ message: 'Server error deactivating announcement.' });
  }
});

export default router;
