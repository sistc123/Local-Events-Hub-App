const express = require("express");

const authenticate = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
} = require("../controllers/eventController");

const {
    eventValidation
} = require("../utils/validation");

const router = express.Router();

router.get("/", getEvents);

router.get("/:id", getEventById);

router.post(
    "/",
    authenticate,
    authorizeRoles("ADMIN"),
    eventValidation,
    createEvent
);

router.put(
    "/:id",
    authenticate,
    authorizeRoles("ADMIN"),
    updateEvent
);

router.delete(
    "/:id",
    authenticate,
    authorizeRoles("ADMIN"),
    deleteEvent
);

module.exports = router;