const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
    trim: true
  },
  user_email: {
    type: String,
    trim: true,
    lowercase: true
  },
  user_avatar: {
    type: String,
    default: ''
  },
  sectors: [{
    type: String,
    trim: true
  }],
  activity_types: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Ensure only one settings document exists (for single user system)
settingsSchema.pre('save', async function(next) {
  if (this.isNew) {
    const existingSettings = await this.constructor.findOne();
    if (existingSettings) {
      // Update existing instead of creating new
      existingSettings.set(this.toObject());
      await existingSettings.save();
      next(new Error('Settings already exists. Use update instead.'));
    }
  }
  next();
});

module.exports = mongoose.model('Settings', settingsSchema);