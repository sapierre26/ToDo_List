// routes/protected.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

const {
  getProfile,
  updateProfile,
  updateProfileImage,
} = require("../controllers/authController");

// Example protected route
router.get("/profile", verifyToken, (req, res) => {
  // req.user was added by the middleware after decoding the token
  res.json({
    message: `Welcome, ${req.user.username || req.user.email || "user"}!`,
    user: req.user,
  });
});

router.get("/profile", authenticateToken, getProfile);
router.put("/profile", authenticateToken, updateProfile);
router.put("/profile/image", authenticateToken, updateProfileImage);

module.exports = router;
