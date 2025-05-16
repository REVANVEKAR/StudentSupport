const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  getStudents,
  getTeachers,
  updateUser,
  getUser,
} = require('../controllers/userController');
const { protect, isAdmin, isTeacher } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/students', protect, isTeacher, getStudents);
router.get('/teachers', protect, getTeachers);
router.get('/:id', protect, getUser);
router.put('/:id', protect, updateUser);

module.exports = router;