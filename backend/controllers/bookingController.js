const Booking = require("../models/bookingModel");
const Car = require("../models/carModel");
const Rating = require("../models/ratingModel");
const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const sendSMS = require("../utils/smsService");
const sendEmail = require("../utils/emailService");

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const {
    carId,
    pickupDate,
    pickupTime,
    returnDate,
    returnTime,
    totalAmount,
    rentalType,
    phoneNumber,
  } = req.body;

  const car = await Car.findById(carId);

  if (!car) {
    res.status(404);
    throw new Error("Car not found");
  }

  // Create Date objects
  const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
  const returnDateTime = new Date(`${returnDate}T${returnTime}`);

  // Calculate difference in hours
  const diffMs = returnDateTime - pickupDateTime;
  const diffHours = diffMs / (1000 * 60 * 60);

  // Validation
  if (diffHours <= 0) {
    res.status(400);
    throw new Error("Return time must be after pickup time");
  }

  // Optional minimum booking validation
  if (diffHours < 2) {
    res.status(400);
    throw new Error("Minimum booking duration is 2 hours");
  }

  // Calculate 50% payment amount
  const initialPaymentAmount = totalAmount * 0.5;

  const booking = await Booking.create({
    user: req.user._id,
    car: carId,
    pickupDate,
    pickupTime,
    returnDate,
    returnTime,
    totalAmount,
    rentalType,
    phoneNumber,
    paymentPercentage: 50, // 50% payment initially
  });

  if (booking) {
    // Send SMS Notification
    const smsBody = `Hello ${req.user.firstname}, your booking for ${car.name} from ${pickupDate} ${pickupTime} to ${returnDate} ${returnTime} (${rentalType}ly rental) is received. Initial payment: $${initialPaymentAmount} (50%). Total: $${totalAmount}. Status: Pending.`;

    await sendSMS(phoneNumber, smsBody);

    // Send Email Notification
    try {
      await sendEmail({
        email: req.user.email,
        subject: "Booking Received - RentCars",
        message: smsBody,
        html: `<h2>Booking Received</h2><p>${smsBody}</p>`,
      });
    } catch (err) {
      console.error("Email could not be sent", err);
    }

    res.status(201).json(booking);
  } else {
    res.status(400);
    throw new Error("Invalid booking data");
  }
});

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("user", "firstname lastname email")
    .populate("car");

  if (booking) {
    res.json(booking);
  } else {
    res.status(404);
    throw new Error("Booking not found");
  }
});

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate(
    "car"
  );
  
  // Get user's ratings
  const userRating = await Rating.findOne({ userId: req.user._id });
  
  // Add rating data to each booking
  const bookingsWithRatings = bookings.map(booking => {
    const bookingObj = booking.toObject();
    
    // Find rating for this specific booking
    if (userRating && userRating.ratings) {
      const ratingForBooking = userRating.ratings.find(
        rating => rating.bookingId.toString() === booking._id.toString()
      );
      bookingObj.rating = ratingForBooking ? ratingForBooking.rating : 0;
    } else {
      bookingObj.rating = 0;
    }
    
    return bookingObj;
  });
  
  res.json(bookingsWithRatings);
});

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
const getBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({})
    .populate("user", "id firstname lastname email")
    .populate("car");
  res.json(bookings);
});

// @desc    Create Stripe Payment Intent
// @route   POST /api/bookings/:id/pay
// @access  Private
const createPaymentSession = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (booking.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  const amount = Math.round(
    booking.totalAmount * (booking.paymentPercentage / 100) * 100
  );

  let paymentIntent;
  const paymentMetadata = {
    bookingId: booking._id.toString(),
    customerId: req.user._id.toString(),
    paymentPercentage: booking.paymentPercentage.toString(),
  };

  // ✅ ONLY CREATE ONCE
  if (booking.stripePaymentIntentId) {
    try {
      paymentIntent = await stripe.paymentIntents.retrieve(
        booking.stripePaymentIntentId
      );
    } catch (error) {
      paymentIntent = null;
    }

    const shouldReuseExistingIntent =
      paymentIntent &&
      paymentIntent.status === "requires_payment_method" &&
      paymentIntent.amount === amount &&
      paymentIntent.metadata?.bookingId === booking._id.toString() &&
      paymentIntent.metadata?.customerId === req.user._id.toString();

    // If missing/stale/mismatched, create a fresh intent for this booking payment step.
    if (!shouldReuseExistingIntent) {
      paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        metadata: paymentMetadata,
      });

      booking.stripePaymentIntentId = paymentIntent.id;
      await booking.save();
    }
  } else {
    paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      metadata: paymentMetadata,
    });

    booking.stripePaymentIntentId = paymentIntent.id;
    await booking.save();
  }

  res.json({
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  });
});

// @desc    Update booking to paid (WebHook or Success Page callback)
// @route   PUT /api/bookings/:id/paid
// @access  Private
const updateBookingToPaid = asyncHandler(async (req, res) => {
  const { paymentIntentId } = req.body;

  if (!paymentIntentId) {
    res.status(400);
    throw new Error("paymentIntentId is required");
  }

  const booking = await Booking.findById(req.params.id)
    .populate("car")
    .populate("user", "firstname email");

  if (booking) {
    if (booking.user._id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to update this booking");
    }

    // Idempotent behavior: if already marked paid with same intent, return current booking.
    if (
      booking.paymentStatus === "completed" &&
      booking.stripePaymentIntentId &&
      booking.stripePaymentIntentId === paymentIntentId
    ) {
      return res.json(booking);
    }

    // Prevent marking a booking paid with an unrelated PaymentIntent.
    if (
      booking.stripePaymentIntentId &&
      booking.stripePaymentIntentId !== paymentIntentId
    ) {
      res.status(400);
      throw new Error("PaymentIntent does not match latest booking payment");
    }

    let paymentIntent;
    try {
      // Verify only. Do not confirm server-side; frontend already confirms via confirmCardPayment.
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      if (error?.type === "StripeInvalidRequestError") {
        res.status(400);
        throw new Error("Invalid or missing PaymentIntent");
      }
      throw error;
    }

    if (!paymentIntent || paymentIntent.status !== "succeeded") {
      res.status(400);
      throw new Error("Payment not completed");
    }

    const bookingMatches = paymentIntent.metadata?.bookingId === booking._id.toString();
    // Backward compatibility: allow older intents that didn't store customerId yet.
    const customerMatches =
      !paymentIntent.metadata?.customerId ||
      paymentIntent.metadata.customerId === req.user._id.toString();

    if (!bookingMatches || !customerMatches) {
      res.status(400);
      throw new Error("Payment does not match this booking");
    }

    const expectedPaymentAmount = Math.round(
      booking.totalAmount * (booking.paymentPercentage / 100) * 100
    );

    if (paymentIntent.amount_received !== expectedPaymentAmount) {
      res.status(400);
      throw new Error("Paid amount does not match required amount");
    }

    booking.stripePaymentIntentId = paymentIntent.id;
    booking.paymentStatus = "completed";
    booking.paidAmount = paymentIntent.amount_received / 100;

    // If full payment (100%), set status to confirmed
    if (booking.paymentPercentage >= 100) {
      booking.status = "confirmed";
    }

    const updatedBooking = await booking.save();

    // Send Confirmation SMS
    const smsBody = booking.paymentPercentage >= 100 
      ? `Payment Completed! Your booking for ${booking.car.name} is fully paid and confirmed. Enjoy your ride!`
      : `Partial Payment Received! ${booking.paymentPercentage}% of your booking for ${booking.car.name} is paid. Remaining amount due: $${booking.totalAmount - (booking.totalAmount * booking.paymentPercentage / 100)}.`;
    
    await sendSMS(booking.phoneNumber, smsBody);

    // Send Confirmation Email
    try {
      await sendEmail({
        email: booking.user.email,
        subject: booking.paymentPercentage >= 100 ? "Booking Fully Paid - RentCars" : "Partial Payment Received - RentCars",
        message: smsBody,
        html: `<h2>${booking.paymentPercentage >= 100 ? "Booking Fully Paid" : "Partial Payment Received"}</h2><p>${smsBody}</p>`,
      });
    } catch (err) {
      console.error("Email could not be sent", err);
    }

    res.json(updatedBooking);
  } else {
    res.status(404);
    throw new Error("Booking not found");
  }
});

// @desc    Update booking proof of identity and payment percentage
// @route   PUT /api/bookings/:id/verify-identity
// @access  Private
const updateBookingIdentity = asyncHandler(async (req, res) => {
  const { proofOfIdentity } = req.body;

  if (typeof proofOfIdentity !== "boolean") {
    res.status(400);
    throw new Error("proofOfIdentity must be a boolean value");
  }

  const booking = await Booking.findById(req.params.id);

  if (booking) {
    if (booking.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to verify this booking");
    }

    booking.proofOfIdentity = proofOfIdentity;
    
    // If identity is verified, allow remaining 50% payment
    if (proofOfIdentity) {
      booking.paymentPercentage = 100; // Full payment now required
    }
    
    const updatedBooking = await booking.save();
    
    // Send SMS Notification
    const smsBody = proofOfIdentity 
      ? `Identity verified! You can now complete the remaining payment for your booking.`
      : `Identity verification pending. Please complete identity verification.`;
    await sendSMS(booking.phoneNumber, smsBody);

    res.json(updatedBooking);
  } else {
    res.status(404);
    throw new Error("Booking not found");
  }
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const booking = await Booking.findById(req.params.id);

  if (booking) {
    // Convert status to lowercase to match enum
    booking.status = status.toLowerCase();
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } else {
    res.status(404);
    throw new Error("Booking not found");
  }
});

module.exports = {
  createBooking,
  getBookingById,
  getMyBookings,
  getBookings,
  createPaymentSession,
  updateBookingToPaid,
  updateBookingIdentity,
  updateBookingStatus,
};
