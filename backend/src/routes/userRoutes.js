const express = require("express");

const authenticate = require("../middleware/authMiddleware");

const {
    getProfile,
    updateProfile,
    changePassword
} = require("../controllers/userController");

const router = express.Router();

router.get(
    "/profile",
    authenticate,
    getProfile
);

router.put(
    "/profile",
    authenticate,
    updateProfile
);

router.put(
    "/change-password",
    authenticate,
    changePassword
);

module.exports = router;