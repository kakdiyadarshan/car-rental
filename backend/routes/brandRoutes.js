const express = require("express");
const router = express.Router();
const {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} = require("../controllers/brandController");
const { protect, admin } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");

router.route("/").get(getBrands).post(protect, admin, upload.single("logo"), createBrand);
router
  .route("/:id")
  .put(protect, admin, upload.single("logo"), updateBrand)
  .delete(protect, admin, deleteBrand);

module.exports = router;
