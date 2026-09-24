const { validationResult } = require("express-validator");
const { pool } = require("../config/database");

const getEvents = async (req, res, next) => {
    try {
        const [events] = await pool.execute(`
            SELECT
                e.id,
                e.title,
                e.description,
                e.category,
                e.location,
                e.latitude,
                e.longitude,
                e.event_date,
                e.event_time,
                e.image_url,
                e.capacity,
                e.created_by,
                e.created_at,
                u.name AS creator_name
            FROM events e
            INNER JOIN users u ON e.created_by = u.id
            ORDER BY e.event_date ASC, e.event_time ASC
        `);

        res.status(200).json({
            success: true,
            count: events.length,
            events
        });
    } catch (error) {
        next(error);
    }
};

const getEventById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [events] = await pool.execute(
            `
            SELECT
                e.id,
                e.title,
                e.description,
                e.category,
                e.location,
                e.latitude,
                e.longitude,
                e.event_date,
                e.event_time,
                e.image_url,
                e.capacity,
                e.created_by,
                e.created_at,
                u.name AS creator_name
            FROM events e
            INNER JOIN users u ON e.created_by = u.id
            WHERE e.id = ?
            `,
            [id]
        );

        if (events.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        res.status(200).json({
            success: true,
            event: events[0]
        });
    } catch (error) {
        next(error);
    }
};

const createEvent = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const {
            title,
            description,
            category,
            location,
            latitude,
            longitude,
            event_date,
            event_time,
            image_url,
            capacity
        } = req.body;

        const [result] = await pool.execute(
            `
            INSERT INTO events
            (
                title,
                description,
                category,
                location,
                latitude,
                longitude,
                event_date,
                event_time,
                image_url,
                capacity,
                created_by
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                title,
                description,
                category,
                location,
                latitude || null,
                longitude || null,
                event_date,
                event_time,
                image_url || null,
                capacity || 100,
                req.user.id
            ]
        );

        res.status(201).json({
            success: true,
            message: "Event created successfully",
            eventId: result.insertId
        });
    } catch (error) {
        next(error);
    }
};

const updateEvent = async (req, res, next) => {
    try {
        const { id } = req.params;

        const {
            title,
            description,
            category,
            location,
            latitude,
            longitude,
            event_date,
            event_time,
            image_url,
            capacity
        } = req.body;

        const [existing] = await pool.execute(
            "SELECT id FROM events WHERE id = ?",
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        await pool.execute(
            `
            UPDATE events
            SET
                title = ?,
                description = ?,
                category = ?,
                location = ?,
                latitude = ?,
                longitude = ?,
                event_date = ?,
                event_time = ?,
                image_url = ?,
                capacity = ?
            WHERE id = ?
            `,
            [
                title,
                description,
                category,
                location,
                latitude || null,
                longitude || null,
                event_date,
                event_time,
                image_url || null,
                capacity || 100,
                id
            ]
        );

        res.status(200).json({
            success: true,
            message: "Event updated successfully"
        });
    } catch (error) {
        next(error);
    }
};

const deleteEvent = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [result] = await pool.execute(
            "DELETE FROM events WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Event deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};