const express = require("express");

const authenticate = require("../middleware/authMiddleware");

const {
    getComments,
    createComment
} = require("../controllers/commentController");

const {
    commentValidation
} = require("../utils/validation");

const router = express.Router();

router.get(
    "/events/:id/comments",
    authenticate,
    getComments
);

router.post(
    "/events/:id/comments",
    authenticate,
    commentValidation,
    createComment
);

module.exports = router;