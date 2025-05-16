const asyncHandler = require('express-async-handler');
const Query = require('../models/queryModel');
const User = require('../models/userModel');
const Subject = require('../models/subjectModel');
const { classifyQuery } = require('../utils/nlpUtils');

// @desc    Create new query
// @route   POST /api/queries
// @access  Private
const createQuery = asyncHandler(async (req, res) => {
  const { text, category, isAnonymous } = req.body;

  if (!text) {
    res.status(400);
    throw new Error('Please add text to your query');
  }

  // Get student info
  const student = await User.findById(req.user.id);
  
  if (!student || student.role !== 'student') {
    res.status(400);
    throw new Error('Only students can create queries');
  }

  // Default to academics if no category specified
  const queryCategory = category || 'academics';
  
  // Create query
  const query = await Query.create({
    student: req.user.id,
    text,
    category: queryCategory,
    isAnonymous: isAnonymous || false,
    status: 'pending',
  });

  // If it's an academic query, use NLP to classify and find appropriate teacher
  if (queryCategory === 'academics') {
    try {
      // Get all subjects to classify against
      const subjects = await Subject.find();
      
      if (subjects.length > 0) {
        // Classify query text to get subject ID
        const subjectId = await classifyQuery(text, subjects);
        
        if (subjectId) {
          query.subject = subjectId;
          
          // Find teachers who teach this subject for the student's semester and section
          const semester = 2 * (25 - parseInt(student.joiningYear)); // Calculate current semester
          
          const eligibleTeachers = await User.find({
            role: 'teacher',
            'classesTeaching': {
              $elemMatch: {
                subject: subjectId,
                semester: semester
              }
            }
          });
          
          if (eligibleTeachers.length > 0) {
            // For simplicity, assign to first matching teacher
            query.teacher = eligibleTeachers[0]._id;
            query.status = 'assigned';
          }
        }
      }
    } catch (error) {
      console.error('Error in NLP classification:', error);
      // Continue with query creation even if classification fails
    }
  } else {
    // For non-academic queries, find teacher with matching category
    const eligibleTeachers = await User.find({
      role: 'teacher',
      categories: queryCategory
    });
    
    if (eligibleTeachers.length > 0) {
      // For simplicity, assign to first matching teacher
      query.teacher = eligibleTeachers[0]._id;
      query.status = 'assigned';
    }
  }
  
  // Save the updated query with assigned teacher (if any)
  await query.save();

  res.status(201).json(query);
});

// @desc    Get all queries
// @route   GET /api/queries
// @access  Private/Teacher
const getQueries = asyncHandler(async (req, res) => {
  const user = req.user;
  
  // Filter queries based on user role
  let queries;
  
  if (user.role === 'teacher') {
    // Teachers only see queries assigned to them
    queries = await Query.find({ teacher: user._id })
      .populate('student', 'name srn')
      .populate('teacher', 'name')
      .populate('subject', 'name code')
      .sort({ createdAt: -1 });
  } else if (user.role === 'admin') {
    // Admins see all queries
    queries = await Query.find({})
      .populate('student', 'name srn')
      .populate('teacher', 'name')
      .populate('subject', 'name code')
      .sort({ createdAt: -1 });
  } else {
    res.status(403);
    throw new Error('Not authorized to view all queries');
  }

  res.status(200).json(queries);
});

// @desc    Get user's queries
// @route   GET /api/queries/my-queries
// @access  Private
const getMyQueries = asyncHandler(async (req, res) => {
  const queries = await Query.find({ student: req.user.id })
    .populate('teacher', 'name')
    .populate('subject', 'name code')
    .sort({ createdAt: -1 });

  res.status(200).json(queries);
});

// @desc    Update query
// @route   PUT /api/queries/:id
// @access  Private
const updateQuery = asyncHandler(async (req, res) => {
  const query = await Query.findById(req.params.id);

  if (!query) {
    res.status(404);
    throw new Error('Query not found');
  }

  // Check if user is authorized to update
  const isAuthorized = 
    (req.user.role === 'student' && query.student.toString() === req.user.id) ||
    (req.user.role === 'teacher' && query.teacher?.toString() === req.user.id) ||
    req.user.role === 'admin';
    
  if (!isAuthorized) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedQuery = await Query.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).populate('student', 'name srn')
    .populate('teacher', 'name')
    .populate('subject', 'name code');

  res.status(200).json(updatedQuery);
});

// @desc    Assign teacher to query
// @route   PUT /api/queries/:id/assign
// @access  Private/Admin
const assignTeacher = asyncHandler(async (req, res) => {
  const { teacherId } = req.body;
  
  if (!teacherId) {
    res.status(400);
    throw new Error('Please provide a teacher ID');
  }
  
  const query = await Query.findById(req.params.id);
  
  if (!query) {
    res.status(404);
    throw new Error('Query not found');
  }
  
  // Check if teacher exists
  const teacher = await User.findById(teacherId);
  
  if (!teacher || teacher.role !== 'teacher') {
    res.status(400);
    throw new Error('Invalid teacher ID');
  }
  
  query.teacher = teacherId;
  query.status = 'assigned';
  
  await query.save();
  
  const updatedQuery = await Query.findById(req.params.id)
    .populate('student', 'name srn')
    .populate('teacher', 'name')
    .populate('subject', 'name code');
  
  res.status(200).json(updatedQuery);
});

// @desc    Add response to query
// @route   POST /api/queries/:id/responses
// @access  Private/Teacher
const addResponse = asyncHandler(async (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    res.status(400);
    throw new Error('Please add text to your response');
  }
  
  const query = await Query.findById(req.params.id);
  
  if (!query) {
    res.status(404);
    throw new Error('Query not found');
  }
  
  // Check if user is authorized to respond
  const isAuthorized = 
    (req.user.role === 'teacher' && query.teacher?.toString() === req.user.id) ||
    req.user.role === 'admin';
    
  if (!isAuthorized) {
    res.status(401);
    throw new Error('User not authorized to respond');
  }
  
  // Add response
  query.responses.push({
    text,
    respondedBy: req.user.id
  });
  
  // Update status to resolved
  query.status = 'resolved';
  
  await query.save();
  
  const updatedQuery = await Query.findById(req.params.id)
    .populate('student', 'name srn')
    .populate('teacher', 'name')
    .populate('subject', 'name code')
    .populate('responses.respondedBy', 'name');
  
  res.status(200).json(updatedQuery);
});

module.exports = {
  createQuery,
  getQueries,
  updateQuery,
  getMyQueries,
  assignTeacher,
  addResponse,
};