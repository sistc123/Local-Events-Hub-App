const { body, param } = require("express-validator");

const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters")
];

const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
];

const eventValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Event title is required")
    .isLength({ max: 255 })
    .withMessage("Event title is too long"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage("Description is too long"),

  body("category")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Category is too long"),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required"),

  body("event_date")
    .notEmpty()
    .withMessage("Event date is required"),

  body("event_time")
    .notEmpty()
    .withMessage("Event time is required"),

  body("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Capacity must be at least 1")
];

const commentValidation = [
  param("id")
    .isInt()
    .withMessage("Invalid event ID"),

  body("comment")
    .trim()
    .notEmpty()
    .withMessage("Comment cannot be empty")
    .isLength({ max: 500 })
    .withMessage("Comment cannot exceed 500 characters")
];

module.exports = {
  registerValidation,
  loginValidation,
  eventValidation,
  commentValidation
};