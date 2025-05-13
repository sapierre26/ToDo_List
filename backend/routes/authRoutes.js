// routes/authRoutes.js
const express = require("express");
const { register, login } = require("../controllers/authController.js");
const auth = require("../middleware/auth.js");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/protected", auth, (req, res) => {
  res.json({ msg: "You are authorized", user: req.user });
});

module.exports = router;
