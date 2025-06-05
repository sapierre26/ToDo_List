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
const { User } = require("../models/initModels.js");

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
router.put("/profile/image", auth, upload.single("image"), updateProfileImage);

router.delete("/delete", auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ msg: "account deleted successfully" });
  } catch (err) {
    console.error("delete account error", err);
    res.status(500).json({ msg: "server error while deleting account" });
  }
});

router.put("/settings", auth, async (req, res) => {
  const { theme, font } = req.body;
  if (!theme || !font) {
    return res.status(400).json({ msg: "Theme and font are required." });
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { theme, font },
      { new: true },
    );
    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json({
      msg: "Settings updated successfully",
      theme: updatedUser.theme,
      font: updatedUser.font,
    });
  } catch (err) {
    console.error("Error updating settings:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/settings", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      theme: user.theme || "light",
      font: user.font || "Arial",
    });
  } catch (err) {
    console.error("Error fetching settings:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
