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
const fs = require('fs');
const path = require('path');

router.post('/', protect, isAdmin, createSubject);
router.get('/', getSubjects);
router.get('/:id', getSubject);
router.put('/:id', protect, isAdmin, updateSubject);
router.delete('/:id', protect, isAdmin, deleteSubject);

// GET /api/subjects/keywords - return keywords.json
router.get('/keywords', (req, res) => {
  const keywordsPath = path.join(__dirname, '../..', 'keywords.json');
  if (!fs.existsSync(keywordsPath)) {
    return res.status(404).json({ error: 'keywords.json not found' });
  }
  const data = fs.readFileSync(keywordsPath, 'utf-8');
  res.json(JSON.parse(data));
});

// GET /api/subjects - return subject names (keys of keywords.json)
router.get('/', (req, res) => {
  const keywordsPath = path.join(__dirname, '../..', 'keywords.json');
  if (!fs.existsSync(keywordsPath)) {
    return res.status(404).json({ error: 'keywords.json not found' });
  }
  const data = fs.readFileSync(keywordsPath, 'utf-8');
  const subjects = Object.keys(JSON.parse(data));
  res.json(subjects);
});

// --- Class/Department CR Mapping ---
const crMapPath = path.join(__dirname, '../..', 'cr_map.json');

// GET /api/subjects/classes - get all class/department/semester/section CR mappings
router.get('/classes', (req, res) => {
  if (!fs.existsSync(crMapPath)) {
    return res.json({});
  }
  const data = fs.readFileSync(crMapPath, 'utf-8');
  res.json(JSON.parse(data));
});

// POST /api/subjects/classes - add/update a CR mapping
router.post('/classes', (req, res) => {
  const { department, semester, section, teacherId } = req.body;
  if (!department || !semester || !section || !teacherId) {
    return res.status(400).json({ error: 'department, semester, section, and teacherId are required' });
  }
  let crMap = {};
  if (fs.existsSync(crMapPath)) {
    crMap = JSON.parse(fs.readFileSync(crMapPath, 'utf-8'));
  }
  const key = `${department}_${semester}_${section}`;
  crMap[key] = teacherId;
  fs.writeFileSync(crMapPath, JSON.stringify(crMap, null, 2));
  res.json({ success: true, crMap });
});

module.exports = router;