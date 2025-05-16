const express = require('express');
const router = express.Router();
const {
  createSubject,
  getSubjects,
  getSubject,
  updateSubject,
  deleteSubject,
} = require('../controllers/subjectController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.post('/', protect, isAdmin, createSubject);
router.get('/', getSubjects);
router.get('/:id', getSubject);
router.put('/:id', protect, isAdmin, updateSubject);
router.delete('/:id', protect, isAdmin, deleteSubject);

module.exports = router;