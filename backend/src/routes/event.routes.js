import express from 'express';
import { z } from 'zod';
import Event from '../models/Event.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

// Validation schemas
const createEventSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  category: z.enum(['academic', 'sports', 'cultural', 'social', 'workshop', 'seminar', 'other']).default('social'),
  location: z.string().min(1).max(200),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  imageUrl: z.string().url().optional(),
  maxAttendees: z.number().int().positive().optional(),
  tags: z.array(z.string().max(50)).optional(),
  requirements: z.string().max(500).optional(),
  contactInfo: z.string().max(200).optional()
});

// Create event
router.post('/', authRequired, async (req, res) => {
  try {
    const parsed = createEventSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid input', errors: parsed.error.errors });
    }

    const eventData = {
      ...parsed.data,
      organizer: req.user._id,
      startDate: new Date(parsed.data.startDate),
      endDate: new Date(parsed.data.endDate)
    };

    const event = new Event(eventData);
    await event.save();
    await event.populate('organizer', 'name avatarUrl');

    res.status(201).json({ event });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error creating event.' });
  }
});

// Get events
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const upcoming = req.query.upcoming === 'true';

    let query = { isPublic: true, isCancelled: false };
    
    if (category) {
      query.category = category;
    }
    
    if (upcoming) {
      query.startDate = { $gte: new Date() };
    }

    const events = await Event.find(query)
      .populate('organizer', 'name avatarUrl')
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({ events });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error fetching events.' });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name avatarUrl')
      .populate('attendees', 'name avatarUrl')
      .lean();

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ event });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Server error fetching event.' });
  }
});

// RSVP to event
router.post('/:id/rsvp', authRequired, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.isCancelled) {
      return res.status(400).json({ message: 'Event is cancelled' });
    }

    const userId = req.user._id;
    const isAttending = event.attendees.includes(userId);

    if (isAttending) {
      // Remove RSVP
      event.attendees = event.attendees.filter(id => !id.equals(userId));
    } else {
      // Check if event is full
      if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
        return res.status(400).json({ message: 'Event is full' });
      }
      
      // Add RSVP
      event.attendees.push(userId);
    }

    await event.save();

    res.json({ 
      message: isAttending ? 'RSVP removed' : 'RSVP added',
      attendeesCount: event.attendeesCount,
      isAttending: !isAttending
    });
  } catch (error) {
    console.error('RSVP error:', error);
    res.status(500).json({ message: 'Server error updating RSVP.' });
  }
});

// Get user's events
router.get('/user/:userId', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const events = await Event.find({ organizer: req.params.userId })
      .populate('organizer', 'name avatarUrl')
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({ events });
  } catch (error) {
    console.error('Get user events error:', error);
    res.status(500).json({ message: 'Server error fetching user events.' });
  }
});

// Update event
router.put('/:id', authRequired, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    const parsed = createEventSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid input', errors: parsed.error.errors });
    }

    const updateData = { ...parsed.data };
    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
    if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('organizer', 'name avatarUrl');

    res.json({ event: updatedEvent });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error updating event.' });
  }
});

// Cancel event
router.delete('/:id', authRequired, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this event' });
    }

    event.isCancelled = true;
    await event.save();

    res.json({ message: 'Event cancelled successfully' });
  } catch (error) {
    console.error('Cancel event error:', error);
    res.status(500).json({ message: 'Server error cancelling event.' });
  }
});

export default router;
