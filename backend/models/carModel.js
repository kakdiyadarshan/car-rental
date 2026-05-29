const mongoose = require("mongoose");

const carSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Luxury",
        "Exotic",
        "Sports",
        "Supercar",
        "Hypercar",
        "Sedan",
        "Hatchback",
        "SUV",
        "MUV",
        "Coupe",
        "other",
      ],
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    pricePerHour: {
      type: Number,
      required: true,
    },
    pricePerDay: {
      type: Number,
      required: true,
    },
    specs: {
      acceleration: String,
      transmission: String,
      seating: String,
      fuel: String,
    },
    features: [String],
    thumbs: [String],
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
