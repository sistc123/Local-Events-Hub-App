const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const { pool } = require("../config/database");
const { generateToken } = require("../utils/jwt");

const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array()
      });
    }

    const { name, email, password } = req.body;

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    const [existingUsers] = await pool.execute(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [normalizedEmail]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [result] = await pool.execute(
      `
      INSERT INTO users
      (name, email, password, role)
      VALUES (?, ?, ?, ?)
      `,
      [
        normalizedName,
        normalizedEmail,
        hashedPassword,
        "USER"
      ]
    );

    const user = {
      id: result.insertId,
      name: normalizedName,
      email: normalizedEmail,
      role: "USER"
    };

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user
    });
  } catch (error) {
    console.error("Registration error:", error);

    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    const [users] = await pool.execute(
      `
      SELECT
        id,
        name,
        email,
        password,
        role,
        profile_image,
        created_at
      FROM users
      WHERE email = ?
      LIMIT 1
      `,
      [normalizedEmail]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const databaseUser = users[0];

    const passwordMatches = await bcrypt.compare(
      password,
      databaseUser.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const user = {
      id: databaseUser.id,
      name: databaseUser.name,
      email: databaseUser.email,
      role: databaseUser.role,
      profile_image: databaseUser.profile_image || null,
      created_at: databaseUser.created_at
    };

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user
    });
  } catch (error) {
    console.error("Login error:", error);

    next(error);
  }
};

module.exports = {
  register,
  login
};