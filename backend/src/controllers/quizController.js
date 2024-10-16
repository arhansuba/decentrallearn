const Quiz = require('../models/Quiz');
const Course = require('../models/Course');
const User = require('../models/User');
const { generateQuiz } = require('../services/ai/quizGenerator');

exports.createQuiz = async (req, res) => {
  try {
    const { courseId, title, questions } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const newQuiz = new Quiz({
      title,
      course: courseId,
      questions
    });

    await newQuiz.save();

    course.quizzes.push(newQuiz._id);
    await course.save();

    res.status(201).json({
      message: 'Quiz created successfully',
      quiz: newQuiz
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating quiz', error: error.message });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate('course', 'title');
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quiz', error: error.message });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const { title, questions } = req.body;

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.quizId,
      { $set: { title, questions } },
      { new: true, runValidators: true }
    );

    if (!updatedQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json({ message: 'Quiz updated successfully', quiz: updatedQuiz });
  } catch (error) {
    res.status(500).json({ message: 'Error updating quiz', error: error.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(req.params.quizId);

    if (!deletedQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Remove quiz reference from the course
    await Course.findByIdAndUpdate(deletedQuiz.course, {
      $pull: { quizzes: deletedQuiz._id }
    });

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting quiz', error: error.message });
  }
};

exports.submitQuizAttempt = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body;
    const userId = req.user.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const score = quiz.calculateScore(answers);
    const attempt = { user: userId, answers, score };

    quiz.attempts.push(attempt);
    await quiz.save();

    // Update user's progress
    await User.findByIdAndUpdate(userId, {
      $push: { quizAttempts: { quiz: quizId, score } }
    });

    res.json({ message: 'Quiz attempt submitted successfully', score });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting quiz attempt', error: error.message });
  }
};

exports.generateAIQuiz = async (req, res) => {
  try {
    const { courseId, difficulty, numberOfQuestions } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const generatedQuiz = await generateQuiz(course.content, difficulty, numberOfQuestions);

    const newQuiz = new Quiz({
      title: `AI-Generated Quiz for ${course.title}`,
      course: courseId,
      questions: generatedQuiz.questions
    });

    await newQuiz.save();

    course.quizzes.push(newQuiz._id);
    await course.save();

    res.json({ message: 'AI Quiz generated successfully', quiz: newQuiz });
  } catch (error) {
    res.status(500).json({ message: 'Error generating AI quiz', error: error.message });
  }
};