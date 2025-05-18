// routes/protected.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

// Example protected route
router.get('/profile', verifyToken, (req, res) => {
  // req.user was added by the middleware after decoding the token
  res.json({
    message: `Welcome, ${req.user.username || req.user.email || 'user'}!`,
    user: req.user
  });
});

module.exports = router;
