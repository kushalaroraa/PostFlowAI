const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    trim: true,
  },
  caption: {
    type: String,
    required: true,
  },
  hashtags: [{
    type: String,
  }],
  tone: {
    type: String,
    default: 'casual',
  },
  style: {
    type: String,
    default: 'statement',
  },
  postType: {
    type: String,
    default: 'Standard',
  },
  persona: {
    type: String,
    enum: ['Professional', 'Gen Z', 'Storytelling', 'Educator'],
    default: 'Professional',
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'posted'],
    default: 'draft',
  },
  imageUrl: {
    type: String,
    default: null,
  },
  platform: {
    type: String,
    enum: ['None', 'X'],
    default: 'None',
  },
  isAiGenerated: {
    type: Boolean,
    default: false,
  },
  aiGeneratedAt: {
    type: Date,
  },
  scheduledAt: {
    type: Date,
    default: null,
  },
  recommendedTime: {
    type: String,
    default: null,
  },
  timingReason: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Post', postSchema);
