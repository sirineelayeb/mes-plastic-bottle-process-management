const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const http = require("http");
require("./config/google-auth-config");
const passport = require("passport");
const authRouter = require("./routes/auth");
const skillRouter = require("./routes/skill");
const machineRouter = require("./routes/machine");
const taskRouter = require("./routes/task");
const processRouter = require("./routes/process");
const logger = require("./utils/logger");

const app = express();
const server = http.createServer(app);

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: "Too many requests from this IP, please try again later.",
// });
// app.use("/auth", limiter);

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
app.use("/tasks", taskRouter);
app.use("/process", processRouter);

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
  io.close(() => {
    logger.info("Socket", "Socket.IO connections closed");
    mongoose.connection.close(() => {
      logger.info("Database", "MongoDB connection closed");
      process.exit(0);
    });
  });
});

module.exports = app;
