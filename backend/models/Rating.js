const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    reviewerId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    feedback: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Optional: Automatically calculate user's average rating after saving
ratingSchema.statics.getAverageRating = async function (userId) {
  const obj = await this.aggregate([
    {
      $match: { userId: userId },
    },
    {
      $group: {
        _id: '$userId',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  try {
    await this.model('User').findByIdAndUpdate(userId, {
      rating: obj[0] ? Math.round(obj[0].averageRating * 10) / 10 : 0,
    });
  } catch (err) {
    console.error(err);
  }
};

ratingSchema.post('save', async function () {
  await this.constructor.getAverageRating(this.userId);
});

ratingSchema.post('remove', async function () {
  await this.constructor.getAverageRating(this.userId);
});

module.exports = mongoose.model('Rating', ratingSchema);
