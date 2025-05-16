const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, srn, subjects, categories, classesTeaching } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user data object
  const userData = {
    name,
    email,
    password: hashedPassword,
    role: role || 'student',
  };

  // Add role-specific fields
  if (role === 'student' && srn) {
    // Validate SRN format: R{year}{department}{number}
    const srnRegex = /^R(\d{2})([A-Z]{2})(\d{3})$/;
    const match = srn.match(srnRegex);

    if (!match) {
      res.status(400);
      throw new Error('Invalid SRN format. Expected format: R{year}{department}{number} (e.g., R21EK031)');
    }

    // Extract SRN components
    const [_, joiningYear, department, studentNumber] = match;
    
    userData.srn = srn;
    userData.college = 'R';
    userData.joiningYear = joiningYear;
    userData.department = department;
    userData.studentNumber = studentNumber;
  } else if (role === 'teacher') {
    if (subjects) userData.subjects = subjects;
    if (categories) userData.categories = categories;
    if (classesTeaching) userData.classesTeaching = classesTeaching;
  }

  // Create user
  const user = await User.create(userData);

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      srn: user.srn,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      srn: user.srn,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  res.status(200).json(user);
});

// @desc    Get all students
// @route   GET /api/users/students
// @access  Private/Teacher
const getStudents = asyncHandler(async (req, res) => {
  const students = await User.find({ role: 'student' }).select('-password');
  res.status(200).json(students);
});

// @desc    Get all teachers
// @route   GET /api/users/teachers
// @access  Private
const getTeachers = asyncHandler(async (req, res) => {
  const teachers = await User.find({ role: 'teacher' }).select('-password');
  res.status(200).json(teachers);
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if user is authorized to update
  if (user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).select('-password');

  res.status(200).json(updatedUser);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if user is authorized to view
  if (user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('User not authorized');
  }

  res.status(200).json(user);
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getStudents,
  getTeachers,
  updateUser,
  getUser,
};