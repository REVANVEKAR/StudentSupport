const express = require('express');
const router = express.Router();
const { uploadSubjectDocument } = require('../controllers/uploadController');
const { protect, isAdmin, isTeacher } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Check file type
const fileFilter = (req, file, cb) => {
  const filetypes = /pdf|docx|pptx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF, DOCX, and PPTX files are allowed!'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10000000 }, // 10MB limit
});

router.post(
  '/subject/:id',
  protect,
  isAdmin,
  upload.single('document'),
  uploadSubjectDocument
);

module.exports = router;