const asyncHandler = require('express-async-handler');
const Subject = require('../models/subjectModel');
const path = require('path');
const { processDocument } = require('../utils/nlpUtils');

// @desc    Upload document to subject
// @route   POST /api/uploads/subject/:id
// @access  Private/Admin
const uploadSubjectDocument = asyncHandler(async (req, res) => {
  const subjectId = req.params.id;
  
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }
  
  // Find subject
  const subject = await Subject.findById(subjectId);
  
  if (!subject) {
    res.status(404);
    throw new Error('Subject not found');
  }
  
  // Add document to subject
  const documentName = req.file.originalname;
  const documentPath = req.file.path;
  
  subject.documents.push({
    name: documentName,
    path: documentPath,
  });
  
  await subject.save();
  
  // Process document to extract keywords
  try {
    const keywords = await processDocument(documentPath);
    
    // Add new keywords to subject, avoiding duplicates
    if (keywords && keywords.length > 0) {
      const existingKeywords = new Set(subject.keywords);
      
      keywords.forEach(keyword => {
        if (!existingKeywords.has(keyword)) {
          subject.keywords.push(keyword);
        }
      });
      
      await subject.save();
    }
  } catch (error) {
    console.error('Error processing document:', error);
    // Continue with document upload even if processing fails
  }
  
  res.status(200).json(subject);
});

module.exports = {
  uploadSubjectDocument,
};