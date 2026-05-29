const express = require("express");
const router = express.Router();
const {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} = require("../controllers/carController");
const { protect, admin } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");

router
  .route("/")
  .get(getCars)
  .post(
    protect,
    admin,
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "thumbs", maxCount: 10 },
    ]),
    createCar
  );
router
  .route("/:id")
  .get(getCarById)
  .put(
    protect,
    admin,
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "thumbs", maxCount: 10 },
    ]),
    updateCar
  )
  .delete(protect, admin, deleteCar);

module.exports = router;
