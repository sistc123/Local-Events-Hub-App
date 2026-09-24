const express = require("express");

const router = express.Router();

const {
  createRSVP,
  cancelRSVP,
  getMyRSVPs
} = require("../controllers/rsvpController");

const authMiddleware = require("../middleware/authMiddleware");

// Create RSVP
router.post(
  "/events/:id/rsvp",
  authMiddleware,
  createRSVP
);

// Cancel RSVP
router.delete(
  "/events/:id/rsvp",
  authMiddleware,
  cancelRSVP
);

// Get current user's RSVPs
router.get(
  "/users/my-rsvps",
  authMiddleware,
  getMyRSVPs
);

module.exports = router;