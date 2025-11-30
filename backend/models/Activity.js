const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['call', 'email', 'meeting', 'visit'],
    required: true
  },
  start_time: {
    type: String,
    required: true
  },
  end_time: {
    type: String
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  contact_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact'
  },
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  opportunity_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Activity', activitySchema);