const mongoose = require('mongoose');

const querySchema = mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    text: {
      type: String,
      required: [true, 'Please add query text'],
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
    },
    category: {
      type: String,
      enum: ['academics', 'placements', 'sports', 'clubs', 'student_help'],
      default: 'academics',
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'assigned', 'resolved'],
      default: 'pending',
    },
    responses: [
      {
        text: {
          type: String,
          required: true,
        },
        respondedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        createdAt: {
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

module.exports = mongoose.model('Query', querySchema);