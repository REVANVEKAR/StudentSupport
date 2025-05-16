const mongoose = require('mongoose');

const subjectSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a subject name'],
      unique: true,
    },
    code: {
      type: String,
      required: [true, 'Please add a subject code'],
      unique: true,
    },
    department: {
      type: String,
      required: [true, 'Please add a department'],
    },
    semester: {
      type: Number,
      required: [true, 'Please add a semester'],
    },
    keywords: [
      {
        type: String,
      },
    ],
    documents: [
      {
        name: String,
        path: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Subject', subjectSchema);