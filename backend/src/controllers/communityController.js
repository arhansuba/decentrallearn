const ForumThread = require('../models/ForumThread');
const ForumReply = require('../models/ForumReply');
const Suggestion = require('../models/Suggestion');
const User = require('../models/User');

exports.createForumThread = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    const newThread = new ForumThread({
      title,
      content,
      author: userId
    });

    await newThread.save();

    res.status(201).json({
      message: 'Forum thread created successfully',
      thread: newThread
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating forum thread', error: error.message });
  }
};

exports.getForumThreads = async (req, res) => {
  try {
    const threads = await ForumThread.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .limit(20);  // Limiting to 20 most recent threads

    res.json(threads);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching forum threads', error: error.message });
  }
};

exports.getForumThreadById = async (req, res) => {
  try {
    const thread = await ForumThread.findById(req.params.threadId)
      .populate('author', 'username')
      .populate({
        path: 'replies',
        populate: { path: 'author', select: 'username' }
      });
    
    if (!thread) {
      return res.status(404).json({ message: 'Forum thread not found' });
    }

    res.json(thread);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching forum thread', error: error.message });
  }
};

exports.createForumReply = async (req, res) => {
  try {
    const { content } = req.body;
    const { threadId } = req.params;
    const userId = req.user.id;

    const thread = await ForumThread.findById(threadId);
    if (!thread) {
      return res.status(404).json({ message: 'Forum thread not found' });
    }

    const newReply = new ForumReply({
      content,
      author: userId,
      thread: threadId
    });

    await newReply.save();

    thread.replies.push(newReply._id);
    await thread.save();

    res.status(201).json({
      message: 'Forum reply created successfully',
      reply: newReply
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating forum reply', error: error.message });
  }
};

exports.createSuggestion = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;

    const newSuggestion = new Suggestion({
      content,
      author: userId
    });

    await newSuggestion.save();

    res.status(201).json({
      message: 'Suggestion created successfully',
      suggestion: newSuggestion
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating suggestion', error: error.message });
  }
};

exports.getSuggestions = async (req, res) => {
  try {
    const suggestions = await Suggestion.find()
      .populate('author', 'username')
      .sort({ votes: -1, createdAt: -1 })
      .limit(20);  // Limiting to 20 top voted and recent suggestions

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching suggestions', error: error.message });
  }
};

exports.voteSuggestion = async (req, res) => {
  try {
    const { suggestionId } = req.params;
    const { voteType } = req.body;  // 'up' or 'down'
    const userId = req.user.id;

    const suggestion = await Suggestion.findById(suggestionId);
    if (!suggestion) {
      return res.status(404).json({ message: 'Suggestion not found' });
    }

    const voteIndex = suggestion.votes.findIndex(vote => vote.user.toString() === userId);

    if (voteIndex > -1) {
      // User has already voted, update their vote
      suggestion.votes[voteIndex].voteType = voteType;
    } else {
      // New vote
      suggestion.votes.push({ user: userId, voteType });
    }

    suggestion.voteCount = suggestion.votes.reduce((acc, vote) => {
      return acc + (vote.voteType === 'up' ? 1 : -1);
    }, 0);

    await suggestion.save();

    res.json({ message: 'Vote recorded successfully', voteCount: suggestion.voteCount });
  } catch (error) {
    res.status(500).json({ message: 'Error voting on suggestion', error: error.message });
  }
};