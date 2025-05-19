// routes/authRoutes.js
const express = require("express");
const { register, login, getProfile, updateProfileImage } = require("../controllers/authController.js");
const auth = require("../middleware/auth.js");
const multer = require("multer");
const path = require("path");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/protected", auth, (req, res) => {
  res.json({ msg: "You are authorized", user: req.user });
});
router.get("/profile", auth, getProfile);
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}_${Date.now()}${ext}`);
  },
});
router.put("/profile", auth, updateProfileImage);

const upload = multer({ storage });
router.put("/profile/image", auth, upload.single("image"), updateProfileImage);

module.exports = router;
