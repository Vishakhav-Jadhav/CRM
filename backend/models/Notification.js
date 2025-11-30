const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error', 'reminder'],
    default: 'info'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  related_entity: {
    type: {
      type: String,
      enum: ['contact', 'company', 'opportunity', 'activity', 'lead', 'expense']
    },
    entity_id: mongoose.Schema.Types.ObjectId
  },
  is_read: {
    type: Boolean,
    default: false
  },
  read_at: {
    type: Date
  },
  expires_at: {
    type: Date
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes for better performance
notificationSchema.index({ user_id: 1 });
notificationSchema.index({ is_read: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ expires_at: 1 });

// Auto-expire notifications
notificationSchema.pre('save', function(next) {
  if (!this.expires_at && this.priority === 'low') {
    // Low priority notifications expire in 7 days
    this.expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  } else if (!this.expires_at && this.priority === 'medium') {
    // Medium priority notifications expire in 30 days
    this.expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  next();
});

module.exports = mongoose.model('Notification', notificationSchema);