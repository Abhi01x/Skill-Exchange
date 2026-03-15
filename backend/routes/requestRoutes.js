const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { sendRequest, updateRequestStatus, getMyRequests } = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

const validateNewRequest = [
  check('receiverId', 'Receiver ID is required').not().isEmpty(),
  check('skillId', 'Skill ID is required').not().isEmpty(),
];

const validateRequest = (req, res, next) => {
  const { validationResult } = require('express-validator');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.route('/')
  .post(protect, validateNewRequest, validateRequest, sendRequest)
  .get(protect, getMyRequests);

router.route('/:id').put(protect, updateRequestStatus);

module.exports = router;
