const Contact = require('../models/Contact');

// Get all contacts with company populated
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .populate('company_id', 'name')
      .sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single contact
const getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id).populate('company_id', 'name');
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create contact
const createContact = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    await contact.populate('company_id', 'name');

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('contacts').emit('contact-created', contact);
    }

    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update contact
const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    ).populate('company_id', 'name');
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('contacts').emit('contact-updated', contact);
    }

    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete contact
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('contacts').emit('contact-deleted', req.params.id);
    }

    res.json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Bulk create contacts
const bulkCreateContacts = async (req, res) => {
  try {
    const contacts = await Contact.insertMany(req.body);
    await Contact.populate(contacts, { path: 'company_id', select: 'name' });
    res.status(201).json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
  bulkCreateContacts
};