const asyncHandler = require('express-async-handler');
const Subject = require('../models/subjectModel');

// @desc    Create new subject
// @route   POST /api/subjects
// @access  Private/Admin
const createSubject = asyncHandler(async (req, res) => {
  const { name, code, department, semester, keywords } = req.body;

  if (!name || !code || !department || !semester) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  // Check if subject exists
  const subjectExists = await Subject.findOne({ $or: [{ name }, { code }] });

  if (subjectExists) {
    res.status(400);
    throw new Error('Subject already exists');
  }

  // Create subject
  const subject = await Subject.create({
    name,
    code,
    department,
    semester,
    keywords: keywords || [],
  });

  res.status(201).json(subject);
});

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Public
const getSubjects = asyncHandler(async (req, res) => {
  const subjects = await Subject.find({});
  res.status(200).json(subjects);
});

// @desc    Get single subject
// @route   GET /api/subjects/:id
// @access  Public
const getSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);

  if (!subject) {
    res.status(404);
    throw new Error('Subject not found');
  }

  res.status(200).json(subject);
});

// @desc    Update subject
// @route   PUT /api/subjects/:id
// @access  Private/Admin
const updateSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);

  if (!subject) {
    res.status(404);
    throw new Error('Subject not found');
  }

  const updatedSubject = await Subject.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedSubject);
});

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
// @access  Private/Admin
const deleteSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);

  if (!subject) {
    res.status(404);
    throw new Error('Subject not found');
  }

  await subject.deleteOne();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  createSubject,
  getSubjects,
  getSubject,
  updateSubject,
  deleteSubject,
};