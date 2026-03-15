const Rating = require('../models/Rating');
const SkillRequest = require('../models/SkillRequest');

// @desc    Rate a user
// @route   POST /api/ratings
// @access  Private
const rateUser = async (req, res, next) => {
  try {
    const { userId, rating, feedback } = req.body;

    // Optional Check: Verify if they had a completed session
    const hasCompletedSession = await SkillRequest.findOne({
      $or: [
        { senderId: req.user._id, receiverId: userId, status: 'completed' },
        { senderId: userId, receiverId: req.user._id, status: 'completed' }
      ]
    });

    if (!hasCompletedSession) {
      res.status(400);
      throw new Error('You can only rate users you had a completed session with');
    }

    // Check if rating already exists
    const existingRating = await Rating.findOne({
      reviewerId: req.user._id,
      userId,
    });

    if (existingRating) {
      existingRating.rating = rating;
      existingRating.feedback = feedback;
      await existingRating.save();
      return res.json(existingRating);
    }

    const review = new Rating({
      reviewerId: req.user._id,
      userId,
      rating,
      feedback,
    });

    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (error) {
    next(error);
  }
};

// @desc    Get ratings for a user
// @route   GET /api/ratings/:userId
// @access  Public
const getUserRatings = async (req, res, next) => {
  try {
    const ratings = await Rating.find({ userId: req.params.userId })
      .populate('reviewerId', 'name');

    res.json(ratings);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  rateUser,
  getUserRatings,
};
