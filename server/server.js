const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const passport = require("passport");
require("./config/google-auth-config");

const authRouter = require("./routes/auth");
const skillRouter = require("./routes/skill");
const machineRouter = require("./routes/machine");
const taskRouter = require("./routes/task");
const processRouter = require("./routes/process");
const logger = require("./utils/logger");
const initMQTT = require("./mqtt/mqttClient");

const app = express();
const server = http.createServer(app);

// ---------------------- Socket.IO ----------------------
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Authenticate socket connection
io.use((socket, next) => {
  const { userId, role, userName } = socket.handshake.auth;
  if (!userId || !role || !userName) {
    return next(new Error("Authentication error"));
  }
  socket.user = { userId, role, userName };
  next();
});

io.on("connection", (socket) => {
  logger.info("Socket.IO", `User connected: ${socket.user.userName} (${socket.user.role})`);

  // Send current active machines to new product_manager clients
  if (socket.user.role === "product_manager") {
    const mqttClient = require("./mqtt/mqttClient").clientInstance;
    if (mqttClient && mqttClient.getActiveMachines) {
      const machines = mqttClient.getActiveMachines();
      machines.forEach((machine) => {
        socket.emit("machine_status", machine);
      });
    }
  }

  socket.on("customEvent", (data) => {
    logger.info("Socket.IO", `Received from ${socket.user.userName}: ${JSON.stringify(data)}`);
  });

  socket.on("disconnect", () => {
    logger.info("Socket.IO", `User disconnected: ${socket.user.userName}`);
  });
});

// Make io available for MQTT client
app.set("io", io);

// ---------------------------------------------------------

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use(passport.initialize());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/auth", authRouter);
app.use("/skills", skillRouter);
app.use("/machines", machineRouter);
app.use("/process", processRouter);
app.use("/tasks", taskRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    logger.success("Database", "Connected to MongoDB");

    // 🔥 Initialize MQTT after DB connection
    initMQTT(io);

    server.listen(PORT, () => {
      logger.success("Server", `Server running on port ${PORT}`);
      logger.info("Server", `Environment: ${process.env.NODE_ENV || "development"}`);
    });
  })
  .catch((err) => {
    logger.error("Database", `Connection error: ${err.message}`);
    process.exit(1);
  });

process.on("SIGTERM", () => {
  logger.warn("Server", "SIGTERM received. Closing server gracefully...");
  server.close(() => {
    logger.info("Server", "HTTP server closed");
    mongoose.connection.close(() => {
      logger.info("Database", "MongoDB connection closed");
      process.exit(0);
    });
  });
});

module.exports = app;
