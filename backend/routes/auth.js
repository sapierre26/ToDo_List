// routes/auth.js
const express = require("express");
const router = express.Router();
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const users = [
    {
        id: 1,
        email: "test@test.com",
        password: "123456"
    }
];

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const isMatch = await bycrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET_KEY, 
        { expiresIn: "1h" }
    );

    res.json({ token });
});

module.exports = router;