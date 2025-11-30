const express = require('express');
const router = express.Router();
const {
  getEmailLogs,
  getEmailLog,
  createEmailLog,
  updateEmailLog,
  deleteEmailLog,
  getEmailStats
} = require('../controllers/emailController');

router.get('/', getEmailLogs);
router.get('/stats', getEmailStats);
router.get('/:id', getEmailLog);
router.post('/', createEmailLog);
router.put('/:id', updateEmailLog);
router.delete('/:id', deleteEmailLog);

module.exports = router;