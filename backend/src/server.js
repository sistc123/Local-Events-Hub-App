require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const http = require("http");
const { Server } = require("socket.io");

const { testDatabaseConnection } = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const rsvpRoutes = require("./routes/rsvpRoutes");
const commentRoutes = require("./routes/commentRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// =====================================================
// BASIC ROUTES
// =====================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Local Events Hub API is running"
  });
});

app.get("/api/health", async (req, res) => {
  const databaseConnected = await testDatabaseConnection();

  res.status(databaseConnected ? 200 : 503).json({
    success: databaseConnected,
    api: "running",
    database: databaseConnected
      ? "connected"
      : "disconnected"
  });
});

// =====================================================
// API ROUTES
// =====================================================

app.use("/api/auth", authRoutes);

app.use("/api/events", eventRoutes);

// IMPORTANT:
// rsvpRoutes contains:
// POST   /events/:id/rsvp
// DELETE /events/:id/rsvp
// GET    /users/my-rsvps
//
// Therefore mount it at /api.
app.use("/api", rsvpRoutes);

app.use("/api", commentRoutes);

app.use("/api/users", userRoutes);

app.get("/api/test-rsvp-route", (req, res) => {
  res.json({
    success: true,
    message: "RSVP route is mounted correctly"
  });
});

// =====================================================
// SOCKET.IO
// =====================================================

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join_event", (eventId) => {
    if (!eventId) {
      return;
    }

    socket.join(`event_${eventId}`);
  });

  socket.on("leave_event", (eventId) => {
    if (!eventId) {
      return;
    }

    socket.leave(`event_${eventId}`);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

app.set("io", io);

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found"
  });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((error, req, res, next) => {
  console.error("Unhandled server error:", error);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error"
  });
});

// =====================================================
// START SERVER
// =====================================================

const PORT = Number(process.env.PORT || 5000);

const startServer = async () => {
  await testDatabaseConnection();

  server.listen(PORT, "0.0.0.0", () => {
    console.log(
      `Local Events Hub API running on port ${PORT}`
    );
  });
};

startServer();