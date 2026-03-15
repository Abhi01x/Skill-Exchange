const express = require('express');
const router = express.Router();
const { sendMessage, getConversation } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, sendMessage);

router.route('/:userId')
  .get(protect, getConversation);

module.exports = router;
