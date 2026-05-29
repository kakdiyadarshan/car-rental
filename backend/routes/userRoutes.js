const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  changePassword,
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");

router.route("/").get(protect, admin, getUsers);
router.post("/register", upload.single("img"), registerUser);
router.post("/login", loginUser);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, upload.single("img"), updateUserProfile);
router.put("/changepassword", protect, changePassword);
router.route("/:id").delete(protect, admin, deleteUser);

module.exports = router;
