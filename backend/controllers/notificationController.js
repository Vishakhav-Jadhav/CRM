const Notification = require('../models/Notification');

// Get notifications for a user
const getNotifications = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      is_read,
      type,
      priority,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const userId = req.user?.userId || req.params.userId;

    const query = { user_id: userId };

    // Filters
    if (is_read !== undefined) query.is_read = is_read === 'true';
    if (type) query.type = type;
    if (priority) query.priority = priority;

    // Don't show expired notifications
    query.$or = [
      { expires_at: { $exists: false } },
      { expires_at: { $gt: new Date() } }
    ];

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const notifications = await Notification.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments(query);

    res.json({
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single notification
const getNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Check if user owns this notification
    if (notification.user_id.toString() !== req.user?.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create notification
const createNotification = async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();

    // Emit real-time update to the specific user
    const io = req.app.get('io');
    if (io) {
      io.to(`user-${notification.user_id}`).emit('notification-created', notification);
    }

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        is_read: true,
        read_at: new Date()
      },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Check if user owns this notification
    if (notification.user_id.toString() !== req.user?.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark all notifications as read for a user
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user?.userId;

    const result = await Notification.updateMany(
      { user_id: userId, is_read: false },
      {
        is_read: true,
        read_at: new Date()
      }
    );

    res.json({
      message: `${result.modifiedCount} notifications marked as read`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Check if user owns this notification
    if (notification.user_id.toString() !== req.user?.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get notification count for a user
const getNotificationCount = async (req, res) => {
  try {
    const userId = req.user?.userId;

    const unreadCount = await Notification.countDocuments({
      user_id: userId,
      is_read: false,
      $or: [
        { expires_at: { $exists: false } },
        { expires_at: { $gt: new Date() } }
      ]
    });

    const totalCount = await Notification.countDocuments({
      user_id: userId,
      $or: [
        { expires_at: { $exists: false } },
        { expires_at: { $gt: new Date() } }
      ]
    });

    res.json({
      total: totalCount,
      unread: unreadCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create system notification (for automated notifications)
const createSystemNotification = async (userId, title, message, type = 'info', priority = 'medium', relatedEntity = null) => {
  try {
    const notification = new Notification({
      title,
      message,
      type,
      priority,
      user_id: userId,
      related_entity: relatedEntity
    });

    await notification.save();

    return notification;
  } catch (error) {
    console.error('Error creating system notification:', error);
    return null;
  }
};

module.exports = {
  getNotifications,
  getNotification,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationCount,
  createSystemNotification
};