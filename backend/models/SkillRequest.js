const mongoose = require('mongoose');

const skillRequestSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    skillId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Skill',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed'],
      default: 'pending',
    },
    scheduledDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SkillRequest', skillRequestSchema);
