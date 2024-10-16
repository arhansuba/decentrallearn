const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const authMiddleware = require('../middleware/authMiddleware');
router.post('/forum', authMiddleware, communityController.createForumThread);
router.get('/forum', communityController.getForumThreads);
router.get('/forum/:threadId', communityController.getForumThreadById);
router.post('/forum/:threadId/reply', authMiddleware, communityController.createForumReply);

// Suggestion routes
router.post('/suggestions', authMiddleware, communityController.createSuggestion);
router.get('/suggestions', communityController.getSuggestions);
router.post('/suggestions/:suggestionId/vote', authMiddleware, communityController.voteSuggestion);

module.exports = router;