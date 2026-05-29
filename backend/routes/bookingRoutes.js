const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookingById,
  getMyBookings,
  getBookings,
  createPaymentSession,
  updateBookingToPaid,
  updateBookingIdentity,
  updateBookingStatus,
} = require("../controllers/bookingController");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/").post(protect, createBooking).get(protect, admin, getBookings);
router.route("/mybookings").get(protect, getMyBookings);
router.route("/:id").get(protect, getBookingById);
router.route("/:id/pay").post(protect, createPaymentSession);
router.route("/:id/paid").put(protect, updateBookingToPaid);
router.route("/:id/verify-identity").put(protect, updateBookingIdentity);
router.route("/:id/status").put(protect, admin, updateBookingStatus);

module.exports = router;
