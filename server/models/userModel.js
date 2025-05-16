const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    role: {
      type: String,
      required: true,
      enum: ['student', 'teacher', 'admin'],
      default: 'student',
    },
    // Student specific fields
    srn: {
      type: String,
      unique: true,
      sparse: true,
    },
    college: {
      type: String,
      sparse: true,
    },
    joiningYear: {
      type: String,
      sparse: true,
    },
    department: {
      type: String,
      sparse: true,
    },
    studentNumber: {
      type: String,
      sparse: true,
    },
    // Teacher specific fields
    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
      },
    ],
    categories: [
      {
        type: String,
        enum: ['academics', 'placements', 'sports', 'clubs', 'student_help'],
      },
    ],
    classesTeaching: [
      {
        subject: String,
        semester: Number,
        section: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);