const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  contact_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact'
  },
  amount: {
    type: Number,
    default: 0
  },
  forecast_amount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost'],
    default: 'lead'
  },
  sector: {
    type: String,
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  probability: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  close_date: {
    type: String,
    trim: true
  },
  owner: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  competitors: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Opportunity', opportunitySchema);