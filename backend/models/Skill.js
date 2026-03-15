const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a skill title'],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: 500,
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['Coding', 'Graphic Design', 'Photography', 'Languages', 'Music', 'Academics', 'Other'],
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Skill', skillSchema);
