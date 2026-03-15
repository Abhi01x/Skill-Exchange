const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { rateUser, getUserRatings } = require('../controllers/ratingController');
const { protect } = require('../middleware/authMiddleware');

const validateRating = [
  check('userId', 'Target User ID is required').not().isEmpty(),
  check('rating', 'Rating is required (1-5)').isInt({ min: 1, max: 5 }),
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
  .post(protect, validateRating, validateRequest, rateUser);

router.route('/:userId')
  .get(getUserRatings);

module.exports = router;
