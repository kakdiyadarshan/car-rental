const Rating = require("../models/ratingModel");
const asyncHandler = require("express-async-handler");

// @desc    Create or update user rating
// @route   POST /api/ratings
// @access  Private
const createOrUpdateRating = asyncHandler(async (req, res) => {
  const { carId, rating, bookingId } = req.body;
  const userId = req.user._id;

  if (!carId || !rating || !bookingId || rating < 1 || rating > 5) {
    res.status(400);
    throw new Error("Valid carId, bookingId, and rating (1-5) are required");
  }

  // Find existing rating document for this user
  let userRating = await Rating.findOne({ userId });

  if (!userRating) {
    // Create new rating document if doesn't exist
    userRating = await Rating.create({
      userId,
      ratings: [{ bookingId, carId, rating }]
    });
  } else {
    // Add new rating to existing array (don't update existing)
    userRating.ratings.push({ bookingId, carId, rating });
    await userRating.save();
  }

  res.status(201).json(userRating);
});

// @desc    Get user ratings
// @route   GET /api/ratings/myratings
// @access  Private
const getMyRatings = asyncHandler(async (req, res) => {
  const userRating = await Rating.findOne({ userId: req.user._id })
    .populate('ratings.carId', 'name image brand')
    .populate('ratings.bookingId', 'status totalAmount pickupDate returnDate');

  if (!userRating) {
    return res.json({ userId: req.user._id, ratings: [] });
  }

  res.json(userRating);
});

// @desc    Get car average rating
// @route   GET /api/ratings/car/:carId
// @access  Public
const getCarRating = asyncHandler(async (req, res) => {
  const carId = req.params.carId;

  // Find all ratings for this car
  const allRatings = await Rating.find({ 'ratings.carId': carId });

  if (!allRatings || allRatings.length === 0) {
    return res.json({ 
      averageRating: 0, 
      totalRatings: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    });
  }

  // Extract all ratings for this car
  const carRatings = [];
  allRatings.forEach(userRating => {
    userRating.ratings.forEach(rating => {
      if (rating.carId.toString() === carId) {
        carRatings.push(rating.rating);
      }
    });
  });

  // Calculate average
  const averageRating = carRatings.reduce((sum, rating) => sum + rating, 0) / carRatings.length;

  // Calculate distribution
  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  carRatings.forEach(rating => {
    ratingDistribution[rating]++;
  });

  res.json({
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    totalRatings: carRatings.length,
    ratingDistribution
  });
});

// @desc    Get all ratings (admin)
// @route   GET /api/ratings
// @access  Private/Admin
const getAllRatings = asyncHandler(async (req, res) => {
  const ratings = await Rating.find({})
    .populate('userId', 'firstname lastname email')
    .populate('ratings.carId', 'name brand');

  res.json(ratings);
});

module.exports = {
  createOrUpdateRating,
  getMyRatings,
  getCarRating,
  getAllRatings
};
