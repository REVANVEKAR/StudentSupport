const express = require('express');
const router = express.Router();
const {
  createQuery,
  getQueries,
  updateQuery,
  getMyQueries,
  assignTeacher,
  addResponse,
} = require('../controllers/queryController');
const { protect, isTeacher, isAdmin } = require('../middleware/authMiddleware');

router.post('/', protect, createQuery);
router.get('/', protect, getQueries);
router.get('/my-queries', protect, getMyQueries);
router.put('/:id', protect, updateQuery);
router.put('/:id/assign', protect, isAdmin, assignTeacher);
router.post('/:id/responses', protect, isTeacher, addResponse);

module.exports = router;