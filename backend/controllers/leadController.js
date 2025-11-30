const Lead = require('../models/Lead');

// Get all leads with filtering and pagination
const getLeads = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status,
      forecast,
      assigned_to,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }

    // Status filter
    if (status && status !== 'all') {
      query.$or = query.$or || [];
      query.$or.push({ lead_status: status }, { status: status });
    }

    // Forecast filter
    if (forecast && forecast !== 'all') {
      query.forecast = forecast;
    }

    // Assigned to filter
    if (assigned_to) {
      query.assigned_to = assigned_to;
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const leads = await Lead.find(query)
      .populate('company_id', 'name')
      .populate('assigned_to', 'name email')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Lead.countDocuments(query);

    res.json({
      leads,
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

// Get single lead
const getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('company_id', 'name')
      .populate('assigned_to', 'name email');

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create lead
const createLead = async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    await lead.populate('company_id', 'name');
    await lead.populate('assigned_to', 'name email');

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('leads').emit('lead-created', lead);
    }

    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update lead
const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    ).populate('company_id', 'name')
     .populate('assigned_to', 'name email');

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('leads').emit('lead-updated', lead);
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete lead
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('leads').emit('lead-deleted', req.params.id);
    }

    res.json({ message: 'Lead deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Bulk create leads
const bulkCreateLeads = async (req, res) => {
  try {
    const leads = await Lead.insertMany(req.body);
    await Lead.populate(leads, [
      { path: 'company_id', select: 'name' },
      { path: 'assigned_to', select: 'name email' }
    ]);

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('leads').emit('leads-bulk-created', leads);
    }

    res.status(201).json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get lead statistics
const getLeadStats = async (req, res) => {
  try {
    const stats = await Lead.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          cold: { $sum: { $cond: [{ $in: ['$lead_status', ['Cold']] }, 1, 0] } },
          warm: { $sum: { $cond: [{ $in: ['$lead_status', ['Warm']] }, 1, 0] } },
          hot: { $sum: { $cond: [{ $in: ['$lead_status', ['Hot']] }, 1, 0] } },
          won: { $sum: { $cond: [{ $in: ['$lead_status', ['Won']] }, 1, 0] } },
          lost: { $sum: { $cond: [{ $in: ['$lead_status', ['Lost']] }, 1, 0] } },
          totalValue: { $sum: '$value' }
        }
      }
    ]);

    res.json(stats[0] || {
      total: 0,
      cold: 0,
      warm: 0,
      hot: 0,
      won: 0,
      lost: 0,
      totalValue: 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  bulkCreateLeads,
  getLeadStats
};