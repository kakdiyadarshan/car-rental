const Car = require("../models/carModel");
const asyncHandler = require("express-async-handler");
const { uploadToS3, deleteFromS3 } = require("../middleware/uploadMiddleware");

// @desc    Fetch all cars
// @route   GET /api/cars
// @access  Public
const getCars = asyncHandler(async (req, res) => {
  const cars = await Car.find({}).populate("brand", "name logo subtitle");
  res.json(cars);
});

// @desc    Fetch single car
// @route   GET /api/cars/:id
// @access  Public
const getCarById = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id).populate("brand", "name logo subtitle");

  if (car) {
    res.json(car);
  } else {
    res.status(404);
    throw new Error("Car not found");
  }
});

// @desc    Create a car
// @route   POST /api/cars
// @access  Private/Admin
const createCar = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      description,
      pricePerHour,
      pricePerDay,
      specs,
      features,
    } = req.body;

    let image = "";
    let thumbs = [];

    // Check if main image exists
    if (req.files && req.files.image && req.files.image.length > 0) {
      image = await uploadToS3(req.files.image[0], "car");
    } else {
      res.status(400);
      throw new Error("Main image is required");
    }

    // Check if thumbnails exist
    if (req.files && req.files.thumbs && req.files.thumbs.length > 0) {
      const uploadPromises = req.files.thumbs.map((file) =>
        uploadToS3(file, "car/thumbs")
      );
      thumbs = await Promise.all(uploadPromises);
    }

    // Safe parsing for specs and features
    let parsedSpecs = {};
    if (specs) {
      try {
        parsedSpecs = typeof specs === "string" ? JSON.parse(specs) : specs;
      } catch (e) {
        console.error("Error parsing specs:", e);
      }
    }

    let parsedFeatures = [];
    if (features) {
      try {
        parsedFeatures =
          typeof features === "string" ? JSON.parse(features) : features;
      } catch (e) {
        console.error("Error parsing features:", e);
      }
    }

    const car = new Car({
      name,
      brand,
      category,
      description,
      image,
      pricePerHour: Number(pricePerHour),
      pricePerDay: Number(pricePerDay),
      specs: parsedSpecs,
      features: parsedFeatures,
      thumbs,
    });

    const createdCar = await car.save();
    res.status(201).json(createdCar);
  } catch (error) {
    res.status(error.status || 500);
    throw new Error(error.message || "Failed to create car");
  }
});

// @desc    Update a car
// @route   PUT /api/cars/:id
// @access  Private/Admin
const updateCar = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      description,
      pricePerHour,
      pricePerDay,
      specs,
      features,
      isAvailable,
      existingThumbs,
    } = req.body;

    const car = await Car.findById(req.params.id);

    if (car) {
      // Update basic fields
      car.name = name || car.name;
      car.brand = brand || car.brand;
      car.category = category || car.category;
      car.description = description || car.description;
      if (pricePerHour !== undefined) car.pricePerHour = Number(pricePerHour);
      if (pricePerDay !== undefined) car.pricePerDay = Number(pricePerDay);
      car.isAvailable = isAvailable !== undefined ? isAvailable === "true" || isAvailable === true : car.isAvailable;

      // Safe parsing for specs and features
      if (specs) {
        try {
          car.specs = typeof specs === "string" ? JSON.parse(specs) : specs;
        } catch (e) {
          console.error("Error parsing specs:", e);
        }
      }
      if (features) {
        try {
          car.features = typeof features === "string" ? JSON.parse(features) : features;
        } catch (e) {
          console.error("Error parsing features:", e);
        }
      }

      // Handle main image update
      if (req.files && req.files.image && req.files.image.length > 0) {
        if (car.image) await deleteFromS3(car.image);
        car.image = await uploadToS3(req.files.image[0], "car");
      }

      // Handle thumbnails (Merging existing with new)
      let finalThumbs = [];

      // Parse existing thumbs (URLs to keep)
      if (existingThumbs) {
        try {
          const parsedExisting =
            typeof existingThumbs === "string"
              ? JSON.parse(existingThumbs)
              : existingThumbs;

          // Delete old thumbs from S3 that are NOT in the 'keep' list
          if (car.thumbs && car.thumbs.length > 0) {
            const thumbsToDelete = car.thumbs.filter(
              (oldUrl) => !parsedExisting.includes(oldUrl)
            );
            const deletePromises = thumbsToDelete.map((url) => deleteFromS3(url));
            await Promise.all(deletePromises);
          }

          finalThumbs = [...parsedExisting];
        } catch (e) {
          console.error("Error parsing existingThumbs:", e);
          finalThumbs = car.thumbs || [];
        }
      } else {
        // If no existingThumbs field, we keep current ones or handle as empty
        finalThumbs = car.thumbs || [];
      }

      // Upload new thumbnails and add to final list
      if (req.files && req.files.thumbs && req.files.thumbs.length > 0) {
        const uploadPromises = req.files.thumbs.map((file) =>
          uploadToS3(file, "car/thumbs")
        );
        const newUploadedThumbs = await Promise.all(uploadPromises);
        finalThumbs = [...finalThumbs, ...newUploadedThumbs];
      }

      car.thumbs = finalThumbs;

      const updatedCar = await car.save();
      res.json(updatedCar);
    } else {
      res.status(404);
      throw new Error("Car not found");
    }
  } catch (error) {
    res.status(error.status || 500);
    throw new Error(error.message || "Failed to update car");
  }
});

// @desc    Delete a car
// @route   DELETE /api/cars/:id
// @access  Private/Admin
const deleteCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);

  if (car) {
    // Delete main image from S3
    if (car.image) {
      await deleteFromS3(car.image);
    }

    // Delete thumbnails from S3
    if (car.thumbs && car.thumbs.length > 0) {
      const deletePromises = car.thumbs.map((thumb) => deleteFromS3(thumb));
      await Promise.all(deletePromises);
    }

    await car.deleteOne();
    res.json({ message: "Car removed" });
  } else {
    res.status(404);
    throw new Error("Car not found");
  }
});

module.exports = {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
};
