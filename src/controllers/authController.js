const jwt = require("jsonwebtoken");
const User = require("../models/User");

function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

const authController = {
  register(req, res, next) {
    try {
      const { username, email, password } = req.body;

      if (User.findByEmail(email)) {
        return res.status(409).json({ error: "Email already registered" });
      }

      if (User.findByUsername(username)) {
        return res.status(409).json({ error: "Username already taken" });
      }

      const user = User.create(username, email, password);
      const token = generateToken(user);

      res.status(201).json({
        message: "User registered successfully",
        user,
        token,
      });
    } catch (err) {
      next(err);
    }
  },

  login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = User.findByEmail(email);

      if (!user || !User.comparePassword(password, user.password)) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = generateToken({
        id: user.id,
        username: user.username,
      });

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          created_at: user.created_at,
        },
        token,
      });
    } catch (err) {
      next(err);
    }
  },

  getProfile(req, res, next) {
    try {
      const user = User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ user });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = authController;
