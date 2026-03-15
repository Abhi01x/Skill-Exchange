const Message = require('../models/Message');

// @desc    Send a message
// @route   POST /api/chat
// @access  Private
const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, messageText } = req.body;

    if (!receiverId || !messageText) {
      res.status(400);
      throw new Error('Please provide receiverId and message');
    }

    const message = new Message({
      senderId: req.user._id,
      receiverId,
      message: messageText,
    });

    const savedMessage = await message.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    next(error);
  }
};

// @desc    Get conversation between two users
// @route   GET /api/chat/:userId
// @access  Private
const getConversation = async (req, res, next) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.user._id },
      ],
    }).sort('createdAt');

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getConversation,
};
