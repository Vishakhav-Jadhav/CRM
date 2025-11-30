const EmailLog = require('../models/EmailLog');
const mongoose = require('mongoose');

// Get all email logs with filtering and pagination
const getEmailLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      contact_id,
      company_id,
      lead_id,
      opportunity_id,
      type,
      status,
      search = '',
      sortBy = 'sent_at',
      sortOrder = 'desc'
    } = req.query;

    const query = {};

    // Entity filters
    if (contact_id) query.contact_id = contact_id;
    if (company_id) query.company_id = company_id;
    if (lead_id) query.lead_id = lead_id;
    if (opportunity_id) query.opportunity_id = opportunity_id;

    // Type and status filters
    if (type) query.type = type;
    if (status) query.status = status;

    // Search filter
    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { body: { $regex: search, $options: 'i' } },
        { from: { $regex: search, $options: 'i' } },
        { to: { $in: [{ $regex: search, $options: 'i' }] } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const emailLogs = await EmailLog.find(query)
      .populate('contact_id', 'first_name last_name email')
      .populate('company_id', 'name')
      .populate('lead_id', 'name email')
      .populate('opportunity_id', 'title')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await EmailLog.countDocuments(query);

    res.json({
      emailLogs,
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

// Get single email log
const getEmailLog = async (req, res) => {
  try {
    const emailLog = await EmailLog.findById(req.params.id)
      .populate('contact_id', 'first_name last_name email')
      .populate('company_id', 'name')
      .populate('lead_id', 'name email')
      .populate('opportunity_id', 'title');

    if (!emailLog) {
      return res.status(404).json({ message: 'Email log not found' });
    }

    res.json(emailLog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create email log
const createEmailLog = async (req, res) => {
  try {
    const emailLog = new EmailLog(req.body);
    await emailLog.save();
    await emailLog.populate('contact_id', 'first_name last_name email');
    await emailLog.populate('company_id', 'name');
    await emailLog.populate('lead_id', 'name email');
    await emailLog.populate('opportunity_id', 'title');

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('emails').emit('email-logged', emailLog);
    }

    res.status(201).json(emailLog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update email log
const updateEmailLog = async (req, res) => {
  try {
    const emailLog = await EmailLog.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    ).populate('contact_id', 'first_name last_name email')
     .populate('company_id', 'name')
     .populate('lead_id', 'name email')
     .populate('opportunity_id', 'title');

    if (!emailLog) {
      return res.status(404).json({ message: 'Email log not found' });
    }

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('emails').emit('email-updated', emailLog);
    }

    res.json(emailLog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete email log
const deleteEmailLog = async (req, res) => {
  try {
    const emailLog = await EmailLog.findByIdAndDelete(req.params.id);

    if (!emailLog) {
      return res.status(404).json({ message: 'Email log not found' });
    }

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('emails').emit('email-deleted', req.params.id);
    }

    res.json({ message: 'Email log deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get email statistics
const getEmailStats = async (req, res) => {
  try {
    const { contact_id, company_id, lead_id, opportunity_id } = req.query;

    let matchQuery = {};
    if (contact_id) matchQuery.contact_id = mongoose.Types.ObjectId(contact_id);
    if (company_id) matchQuery.company_id = mongoose.Types.ObjectId(company_id);
    if (lead_id) matchQuery.lead_id = mongoose.Types.ObjectId(lead_id);
    if (opportunity_id) matchQuery.opportunity_id = mongoose.Types.ObjectId(opportunity_id);

    const stats = await EmailLog.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          sent: { $sum: { $cond: [{ $eq: ['$type', 'sent'] }, 1, 0] } },
          received: { $sum: { $cond: [{ $eq: ['$type', 'received'] }, 1, 0] } },
          delivered: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] } },
          opened: { $sum: { $cond: [{ $eq: ['$status', 'opened'] }, 1, 0] } },
          clicked: { $sum: { $cond: [{ $eq: ['$status', 'clicked'] }, 1, 0] } },
          bounced: { $sum: { $cond: [{ $eq: ['$status', 'bounced'] }, 1, 0] } }
        }
      }
    ]);

    res.json(stats[0] || {
      total: 0,
      sent: 0,
      received: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getEmailLogs,
  getEmailLog,
  createEmailLog,
  updateEmailLog,
  deleteEmailLog,
  getEmailStats
};