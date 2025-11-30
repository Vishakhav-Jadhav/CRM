const Activity = require('../models/Activity');

// Get all activities with populated references
const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate('contact_id', 'first_name last_name')
      .populate('company_id', 'name')
      .populate('opportunity_id', 'title')
      .sort({ start_time: -1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single activity
const getActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate('contact_id', 'first_name last_name')
      .populate('company_id', 'name')
      .populate('opportunity_id', 'title');
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create activity
const createActivity = async (req, res) => {
  try {
    const activity = new Activity(req.body);
    await activity.save();
    await activity.populate('contact_id', 'first_name last_name');
    await activity.populate('company_id', 'name');
    await activity.populate('opportunity_id', 'title');
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update activity
const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    )
      .populate('contact_id', 'first_name last_name')
      .populate('company_id', 'name')
      .populate('opportunity_id', 'title');
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete activity
const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json({ message: 'Activity deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity
};