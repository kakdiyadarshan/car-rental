const Feedback = require('../models/feedbackModel');
const asyncHandler = require('express-async-handler');

// @desc    Create new feedback
// @route   POST /api/feedback
// @access  Private
const createFeedback = asyncHandler(async (req, res) => {
  const { rating, text, role } = req.body;

  const feedbackExists = await Feedback.findOne({ user: req.user._id });

  if (feedbackExists) {
    res.status(400);
    throw new Error('You have already submitted feedback. Please edit your existing feedback.');
  }

  const feedback = await Feedback.create({
    user: req.user._id,
    name: `${req.user.firstname} ${req.user.lastname}`,
    role: role || 'Verified Customer',
    rating: Number(rating),
    text,
    image: req.user.img || '', // Use user's profile image if available
  });

  if (feedback) {
    res.status(201).json(feedback);
  } else {
    res.status(400);
    throw new Error('Invalid feedback data');
  }
});

// @desc    Get all public feedback
// @route   GET /api/feedback
// @access  Public
const getFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.find({ isPublic: true }).sort({ createdAt: -1 });
  res.json(feedback);
});

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private/Admin
const deleteFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);

  if (feedback) {
    await feedback.deleteOne();
    res.json({ message: 'Feedback removed' });
  } else {
    res.status(404);
    throw new Error('Feedback not found');
  }
});

// @desc    Get logged in user feedback
// @route   GET /api/feedback/mine
// @access  Private
const getMyFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findOne({ user: req.user._id });
  if (feedback) {
    res.json(feedback);
  } else {
    res.json(null); // Return null if no feedback found
  }
});

// @desc    Update feedback
// @route   PUT /api/feedback/:id
// @access  Private
const updateFeedback = asyncHandler(async (req, res) => {
  const { rating, text, role } = req.body;
  const feedback = await Feedback.findById(req.params.id);

  if (feedback) {
    if (feedback.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('You can only edit your own feedback.');
    }

    feedback.rating = Number(rating) || feedback.rating;
    feedback.text = text || feedback.text;
    feedback.role = role || feedback.role;
    feedback.name = `${req.user.firstname} ${req.user.lastname}`; // Update name if user changed it
    feedback.image = req.user.img || feedback.image; // Update image if user changed it

    const updatedFeedback = await feedback.save();
    res.json(updatedFeedback);
  } else {
    res.status(404);
    throw new Error('Feedback not found');
  }
});

module.exports = {
  createFeedback,
  getFeedback,
  deleteFeedback,
  getMyFeedback,
  updateFeedback,
};
