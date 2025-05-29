const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middleware/auth.js");
const {
  register,
  login,
  getProfile,
  updateProfile,
  updateProfileImage,
} = require("../controllers/authController.js");
const User = require("../models/userSchema.js");

// Memory storage (does not save to disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/register", register);
router.post("/login", login);

router.get("/protected", auth, (req, res) => {
  res.json({ msg: "You are authorized", user: req.user });
});

router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);

// Use memory storage instead of writing to 'uploads/'
router.put(
  "/profile/image",
  auth,
  upload.single("image"),
  updateProfileImage
);

router.delete("/delete", auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ msg: "account deleted successfully" });
  } catch (err) {
    console.error("delete account error", err);
    res.status(500).json({ msg: "server error while deleting account" });
  }
});

module.exports = router;
