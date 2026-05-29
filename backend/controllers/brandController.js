const Brand = require("../models/brandModel");
const asyncHandler = require("express-async-handler");
const { deleteFromS3, uploadToS3 } = require("../middleware/uploadMiddleware");

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
const getBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find({});
  res.json(brands);
});

// @desc    Create a brand
// @route   POST /api/brands
// @access  Private/Admin
const createBrand = asyncHandler(async (req, res) => {
  const { name, subtitle, tagline, tag, accent } = req.body;
  const folder = req.query.folder || "brand";
  
  let logo = "";
  if (req.file) {
    logo = await uploadToS3(req.file, folder);
  }

  const brandExists = await Brand.findOne({ name });

  if (brandExists) {
    // If brand already exists, we should delete the newly uploaded image from S3
    if (logo) await deleteFromS3(logo);
    res.status(400);
    throw new Error("Brand already exists");
  }

  const brand = await Brand.create({
    name,
    logo,
    subtitle,
    tagline,
    tag,
    accent,
  });

  if (brand) {
    res.status(201).json(brand);
  } else {
    // Delete newly uploaded image if brand creation fails
    if (logo) await deleteFromS3(logo);
    res.status(400);
    throw new Error("Invalid brand data");
  }
});

// @desc    Update a brand
// @route   PUT /api/brands/:id
// @access  Private/Admin
const updateBrand = asyncHandler(async (req, res) => {
  const { name, subtitle, tagline, tag, accent } = req.body;
  const folder = req.query.folder || "brand";

  const brand = await Brand.findById(req.params.id);

  if (brand) {
    // If a new image is uploaded, delete the old one from S3 and update
    if (req.file) {
      const newLogo = await uploadToS3(req.file, folder);
      if (brand.logo) await deleteFromS3(brand.logo);
      brand.logo = newLogo;
    }

    brand.name = name || brand.name;
    brand.subtitle = subtitle || brand.subtitle;
    brand.tagline = tagline || brand.tagline;
    brand.tag = tag || brand.tag;
    brand.accent = accent || brand.accent;

    const updatedBrand = await brand.save();
    res.json(updatedBrand);
  } else {
    res.status(404);
    throw new Error("Brand not found");
  }
});

// @desc    Delete a brand
// @route   DELETE /api/brands/:id
// @access  Private/Admin
const deleteBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);

  if (brand) {
    // Delete image from S3 before deleting from DB
    if (brand.logo) {
      await deleteFromS3(brand.logo);
    }
    await brand.deleteOne();
    res.json({ message: "Brand removed" });
  } else {
    res.status(404);
    throw new Error("Brand not found");
  }
});

module.exports = {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
};
