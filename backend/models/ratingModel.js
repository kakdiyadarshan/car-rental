const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true // One rating document per user
    },
    ratings: [
      {
        bookingId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Booking',
          required: true
        },
        carId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Car',
          required: true
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
