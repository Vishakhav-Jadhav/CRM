const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  lead_status: {
    type: String,
    enum: ['Cold', 'Warm', 'Hot', 'Won', 'Lost'],
    default: 'Cold'
  },
  status: {
    type: String,
    enum: ['Cold', 'Warm', 'Hot', 'Won', 'Lost'],
    default: 'Cold'
  },
  source: {
    type: String,
    trim: true
  },
  forecast: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Very High'],
    default: 'Medium'
  },
  value: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    trim: true
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [{
    type: String,
    trim: true
  }],
  last_contact: {
    type: Date
  },
  next_followup: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better performance
leadSchema.index({ name: 1 });
leadSchema.index({ email: 1 });
leadSchema.index({ company: 1 });
leadSchema.index({ lead_status: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ forecast: 1 });
leadSchema.index({ assigned_to: 1 });
leadSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Lead', leadSchema);