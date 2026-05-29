const mongoose = require("mongoose");

const brandSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    logo: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: false,
    },
    tagline: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    accent: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
