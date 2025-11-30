const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getNotifications,
  getNotification,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationCount
} = require('../controllers/notificationController');

// Apply auth middleware to all routes
router.use(auth);

// Routes
router.get('/', getNotifications);
router.get('/count', getNotificationCount);
router.get('/:id', getNotification);
router.post('/', createNotification);
router.put('/:id/read', markAsRead);
router.put('/mark-all-read', markAllAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;