const { pool } = require("../config/database");

const createRSVP = async (req, res, next) => {
    try {
        const { id: eventId } = req.params;
        const userId = req.user.id;

        // Check event
        const [events] = await pool.execute(
            "SELECT id, capacity FROM events WHERE id = ?",
            [eventId]
        );

        if (events.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        // Check existing RSVP
        const [existingRSVP] = await pool.execute(
            `
            SELECT id, status
            FROM rsvps
            WHERE user_id = ? AND event_id = ?
            `,
            [userId, eventId]
        );

        if (existingRSVP.length > 0) {

            // Already actively RSVP'd
            if (existingRSVP[0].status === "CONFIRMED") {
                return res.status(409).json({
                    success: false,
                    message: "You have already RSVP'd to this event"
                });
            }

            // Restore cancelled RSVP
            await pool.execute(
                `
                UPDATE rsvps
                SET status = 'CONFIRMED'
                WHERE id = ?
                `,
                [existingRSVP[0].id]
            );

            return res.status(200).json({
                success: true,
                message: "RSVP restored successfully"
            });
        }

        // Count active RSVPs
        const [countResult] = await pool.execute(
            `
            SELECT COUNT(*) AS total
            FROM rsvps
            WHERE event_id = ?
            AND status = 'CONFIRMED'
            `,
            [eventId]
        );

        const currentRSVPs = Number(countResult[0].total);
        const capacity = Number(events[0].capacity);

        // Check capacity
        if (currentRSVPs >= capacity) {
            return res.status(409).json({
                success: false,
                message: "This event is currently full"
            });
        }

        // Create RSVP
        await pool.execute(
            `
            INSERT INTO rsvps
            (user_id, event_id, status)
            VALUES (?, ?, 'CONFIRMED')
            `,
            [userId, eventId]
        );

        return res.status(201).json({
            success: true,
            message: "RSVP successful"
        });

    } catch (error) {
        console.error("CREATE RSVP ERROR:", error);
        next(error);
    }
};


const cancelRSVP = async (req, res, next) => {
    try {
        const { id: eventId } = req.params;
        const userId = req.user.id;

        const [result] = await pool.execute(
            `
            UPDATE rsvps
            SET status = 'CANCELLED'
            WHERE user_id = ?
            AND event_id = ?
            AND status = 'CONFIRMED'
            `,
            [userId, eventId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Active RSVP not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "RSVP cancelled successfully"
        });

    } catch (error) {
        console.error("CANCEL RSVP ERROR:", error);
        next(error);
    }
};


const getMyRSVPs = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const [rsvps] = await pool.execute(
            `
            SELECT
                r.id AS rsvp_id,
                r.status,
                r.created_at AS rsvp_created_at,
                e.*
            FROM rsvps r
            INNER JOIN events e
                ON r.event_id = e.id
            WHERE r.user_id = ?
            AND r.status = 'CONFIRMED'
            ORDER BY e.event_date ASC, e.event_time ASC
            `,
            [userId]
        );

        return res.status(200).json({
            success: true,
            count: rsvps.length,
            rsvps
        });

    } catch (error) {
        console.error("GET MY RSVPS ERROR:", error);
        next(error);
    }
};


module.exports = {
    createRSVP,
    cancelRSVP,
    getMyRSVPs
};