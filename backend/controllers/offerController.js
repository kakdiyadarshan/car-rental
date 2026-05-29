const Offer = require("../models/offerModel");
const asyncHandler = require("express-async-handler");

// @desc    Get all active offers
// @route   GET /api/offers
// @access  Public
const getOffers = asyncHandler(async (req, res) => {
  const offers = await Offer.find({ isActive: true });
  res.json(offers);
});

// @desc    Create an offer
// @route   POST /api/offers
// @access  Private/Admin
const createOffer = asyncHandler(async (req, res) => {
  const { title, discount, desc, code, color, image, validTill } = req.body;

  const offerExists = await Offer.findOne({ code });

  if (offerExists) {
    res.status(400);
    throw new Error("Offer with this code already exists");
  }

  const offer = await Offer.create({
    title,
    discount,
    desc,
    code,
    color,
    image,
    validTill,
  });

  if (offer) {
    res.status(201).json(offer);
  } else {
    res.status(400);
    throw new Error("Invalid offer data");
  }
});

// @desc    Update an offer
// @route   PUT /api/offers/:id
// @access  Private/Admin
const updateOffer = asyncHandler(async (req, res) => {
  const { title, discount, desc, code, color, image, validTill, isActive } = req.body;

  const offer = await Offer.findById(req.params.id);

  if (offer) {
    offer.title = title || offer.title;
    offer.discount = discount || offer.discount;
    offer.desc = desc || offer.desc;
    offer.code = code || offer.code;
    offer.color = color || offer.color;
    offer.image = image || offer.image;
    offer.validTill = validTill || offer.validTill;
    offer.isActive = isActive !== undefined ? isActive : offer.isActive;

    const updatedOffer = await offer.save();
    res.json(updatedOffer);
  } else {
    res.status(404);
    throw new Error("Offer not found");
  }
});

// @desc    Delete an offer
// @route   DELETE /api/offers/:id
// @access  Private/Admin
const deleteOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findById(req.params.id);

  if (offer) {
    await offer.deleteOne();
    res.json({ message: "Offer removed" });
  } else {
    res.status(404);
    throw new Error("Offer not found");
  }
});

module.exports = {
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer,
};
