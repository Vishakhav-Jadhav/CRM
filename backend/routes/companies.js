const express = require('express');
const router = express.Router();
const {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  bulkCreateCompanies
} = require('../controllers/companyController');

router.get('/', getCompanies);
router.get('/:id', getCompany);
router.post('/', createCompany);
router.put('/:id', updateCompany);
router.delete('/:id', deleteCompany);
router.post('/bulk', bulkCreateCompanies);

module.exports = router;