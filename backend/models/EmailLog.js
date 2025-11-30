const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    required: true
  },
  from: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  to: [{
    type: String,
    required: true,
    trim: true,
    lowercase: true
  }],
  cc: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  bcc: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  type: {
    type: String,
    enum: ['sent', 'received', 'draft'],
    default: 'sent'
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed'],
    default: 'sent'
  },
  contact_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact'
  },
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  lead_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead'
  },
  opportunity_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity'
  },
  sent_at: {
    type: Date,
    default: Date.now
  },
  opened_at: {
    type: Date
  },
  clicked_at: {
    type: Date
  },
  attachments: [{
    filename: String,
    size: Number,
    url: String
  }],
  tags: [{
    type: String,
    trim: true
  }],
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes for better performance
emailLogSchema.index({ from: 1 });
emailLogSchema.index({ to: 1 });
emailLogSchema.index({ contact_id: 1 });
emailLogSchema.index({ company_id: 1 });
emailLogSchema.index({ lead_id: 1 });
emailLogSchema.index({ opportunity_id: 1 });
emailLogSchema.index({ sent_at: -1 });
emailLogSchema.index({ type: 1 });
emailLogSchema.index({ status: 1 });

module.exports = mongoose.model('EmailLog', emailLogSchema);