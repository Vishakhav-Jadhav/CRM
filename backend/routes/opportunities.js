const express = require('express');
const router = express.Router();
const {
  getOpportunities,
  getOpportunity,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  bulkCreateOpportunities
} = require('../controllers/opportunityController');

router.get('/', getOpportunities);
router.get('/:id', getOpportunity);
router.post('/', createOpportunity);
router.put('/:id', updateOpportunity);
router.delete('/:id', deleteOpportunity);
router.post('/bulk', bulkCreateOpportunities);

module.exports = router;