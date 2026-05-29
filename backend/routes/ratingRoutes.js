const express = require("express");
const router = express.Router();
const {
  createOrUpdateRating,
  getMyRatings,
  getCarRating,
  getAllRatings,
} = require("../controllers/ratingController");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/").post(protect, createOrUpdateRating);
router.route("/myratings").get(protect, getMyRatings);
router.route("/car/:carId").get(getCarRating);
router.route("/").get(protect, admin, getAllRatings);

module.exports = router;
