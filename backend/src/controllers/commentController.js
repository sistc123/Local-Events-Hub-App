const { validationResult } = require("express-validator");
const { pool } = require("../config/database");

const getComments = async (req, res, next) => {
    try {
        const { id: eventId } = req.params;

        const [comments] = await pool.execute(
            `
            SELECT
                c.id,
                c.event_id,
                c.user_id,
                c.comment,
                c.created_at,
                u.name AS user_name,
                u.profile_image
            FROM comments c
            INNER JOIN users u
                ON c.user_id = u.id
            WHERE c.event_id = ?
            ORDER BY c.created_at ASC
            `,
            [eventId]
        );

        res.status(200).json({
            success: true,
            comments
        });
    } catch (error) {
        next(error);
    }
};

const createComment = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { id: eventId } = req.params;
        const { comment } = req.body;
        const userId = req.user.id;

        const [events] = await pool.execute(
            "SELECT id FROM events WHERE id = ?",
            [eventId]
        );

        if (events.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        const [result] = await pool.execute(
            `
            INSERT INTO comments
            (event_id, user_id, comment)
            VALUES (?, ?, ?)
            `,
            [eventId, userId, comment]
        );

        const [newComment] = await pool.execute(
            `
            SELECT
                c.id,
                c.event_id,
                c.user_id,
                c.comment,
                c.created_at,
                u.name AS user_name,
                u.profile_image
            FROM comments c
            INNER JOIN users u
                ON c.user_id = u.id
            WHERE c.id = ?
            `,
            [result.insertId]
        );

        const io = req.app.get("io");

        if (io) {
            io.to(`event_${eventId}`).emit(
                "new_comment",
                newComment[0]
            );
        }

        res.status(201).json({
            success: true,
            message: "Comment added successfully",
            comment: newComment[0]
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getComments,
    createComment
};