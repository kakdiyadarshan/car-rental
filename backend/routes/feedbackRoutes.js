const express = require('express');
const router = express.Router();
const {
  createFeedback,
  getFeedback,
  deleteFeedback,
  getMyFeedback,
  updateFeedback,
} = require('../controllers/feedbackController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createFeedback)
  .get(getFeedback);

router.route('/mine').get(protect, getMyFeedback);

router.route('/:id')
  .delete(protect, admin, deleteFeedback)
  .put(protect, updateFeedback);

module.exports = router;
