const mongoose = require('mongoose');

const SuggestionSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  votes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    voteType: {
      type: String,
      enum: ['up', 'down']
    }
  }],
  voteCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  tags: [String]
}, { timestamps: true });

SuggestionSchema.methods.calculateVoteCount = function() {
  return this.votes.reduce((acc, vote) => {
    return acc + (vote.voteType === 'up' ? 1 : -1);
  }, 0);
};

SuggestionSchema.pre('save', function(next) {
  if (this.isModified('votes')) {
    this.voteCount = this.calculateVoteCount();
  }
  next();
});

module.exports = mongoose.model('Suggestion', SuggestionSchema);