const Settings = require('../models/Settings');

// Get settings (should only be one document)
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default settings if none exist
      settings = new Settings({
        user_name: 'CRM User',
        user_email: '',
        user_avatar: '',
        sectors: ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Education', 'Energy'],
        activity_types: ['call', 'email', 'visit', 'meeting']
      });
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update settings
const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Create new settings if none exist
      settings = new Settings(req.body);
      await settings.save();
    } else {
      // Update existing settings
      settings = await Settings.findByIdAndUpdate(
        settings._id,
        { ...req.body, updatedAt: new Date() },
        { new: true }
      );
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings
};