const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    pickupDate: {
      type: Date,
      required: true,
    },
    pickupTime: {
      type: String,
      required: true,
    },
    returnDate: {
      type: Date,
      required: true,
    },
    returnTime: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    rentalType: {
      type: String,
      enum: ["hour", "day"],
      required: true,
    },
    proofOfIdentity: {
      type: Boolean,
      default: false,
    },
    paymentPercentage: {
      type: Number,
      default: 50, // 50% payment initially
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "confirmed", "cancelled", "completed", "approved"],
        message: "{VALUE} is not a valid status",
      },
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    stripeSessionId: String,
    stripePaymentIntentId: String,
    paidAmount: {
      type: Number,
      default: 0,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
