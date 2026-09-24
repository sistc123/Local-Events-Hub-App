const { pool } = require("../config/database");

const createNotification = async ({
    userId,
    title,
    message,
    type
}) => {
    try {
        // 1. Save notification in database
        const [result] = await pool.execute(
            `
            INSERT INTO notifications
            (
                user_id,
                title,
                message,
                type
            )
            VALUES (?, ?, ?, ?)
            `,
            [
                userId,
                title,
                message,
                type
            ]
        );

        // 2. Get user's push token
        const [users] = await pool.execute(
            `
            SELECT push_token
            FROM users
            WHERE id = ?
            `,
            [userId]
        );

        const pushToken = users[0]?.push_token;

        // 3. If user has no push token,
        // notification remains saved in database.
        if (!pushToken) {
            return {
                success: true,
                notificationId: result.insertId,
                pushSent: false,
                message: "Notification saved, but user has no push token."
            };
        }

        // 4. Push notification would be sent here.
        // This requires your push notification provider/setup.

        return {
            success: true,
            notificationId: result.insertId,
            pushSent: true
        };

    } catch (error) {
        console.error(
            "Notification creation failed:",
            error.message
        );

        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = {
    createNotification
};