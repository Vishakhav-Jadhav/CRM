const express = require('express');
const router = express.Router();
const {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  bulkCreateLeads,
  getLeadStats
} = require('../controllers/leadController');

router.get('/', getLeads);
router.get('/stats', getLeadStats);
router.get('/:id', getLead);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);
router.post('/bulk', bulkCreateLeads);

module.exports = router;