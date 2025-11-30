const Opportunity = require('../models/Opportunity');

// Get all opportunities with populated references
const getOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find()
      .populate('company_id', 'name')
      .populate('contact_id', 'first_name last_name')
      .sort({ createdAt: -1 });
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single opportunity
const getOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate('company_id', 'name')
      .populate('contact_id', 'first_name last_name');
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }
    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create opportunity
const createOpportunity = async (req, res) => {
  try {
    const opportunity = new Opportunity(req.body);
    await opportunity.save();
    await opportunity.populate('company_id', 'name');
    await opportunity.populate('contact_id', 'first_name last_name');
    res.status(201).json(opportunity);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update opportunity
const updateOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    )
      .populate('company_id', 'name')
      .populate('contact_id', 'first_name last_name');
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }
    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete opportunity
const deleteOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findByIdAndDelete(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }
    res.json({ message: 'Opportunity deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Bulk create opportunities
const bulkCreateOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.insertMany(req.body);
    await Opportunity.populate(opportunities, [
      { path: 'company_id', select: 'name' },
      { path: 'contact_id', select: 'first_name last_name' }
    ]);
    res.status(201).json(opportunities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getOpportunities,
  getOpportunity,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  bulkCreateOpportunities
};