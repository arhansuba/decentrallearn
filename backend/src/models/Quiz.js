const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  explanation: String
});

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  questions: [QuestionSchema],
  timeLimit: Number, // in minutes
  attempts: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    score: Number,
    answers: [{
      question: mongoose.Schema.Types.ObjectId,
      selectedOption: Number
    }],
    date: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

QuizSchema.methods.calculateScore = function(userAnswers) {
  let score = 0;
  this.questions.forEach((question, index) => {
    const userAnswer = userAnswers[index];
    if (userAnswer !== undefined && question.options[userAnswer].isCorrect) {
      score++;
    }
  });
  return (score / this.questions.length) * 100;
};

module.exports = mongoose.model('Quiz', QuizSchema);
