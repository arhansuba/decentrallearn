const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/', authMiddleware, roleMiddleware(['instructor', 'admin']), quizController.createQuiz);
router.get('/:quizId', authMiddleware, quizController.getQuizById);
router.put('/:quizId', authMiddleware, roleMiddleware(['instructor', 'admin']), quizController.updateQuiz);
router.delete('/:quizId', authMiddleware, roleMiddleware(['admin']), quizController.deleteQuiz);
router.post('/:quizId/submit', authMiddleware, quizController.submitQuizAttempt);
router.post('/generate', authMiddleware, roleMiddleware(['instructor', 'admin']), quizController.generateAIQuiz);

module.exports = router;