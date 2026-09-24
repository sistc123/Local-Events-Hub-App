const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "local_events_hub",

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const testDatabaseConnection = async () => {
  try {
    const connection = await pool.getConnection();

    console.log("MySQL database connected successfully");

    connection.release();

    return true;
  } catch (error) {
    console.error("MySQL database connection failed:", error.message);

    return false;
  }
};

module.exports = {
  pool,
  testDatabaseConnection
};