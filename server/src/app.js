const express = require("express");

const cors = require("cors");

const taskRoutes = require("./routes/taskRoutes");

const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(cors({ origin: ["http://localhost:5173", "https://taskflow-dashboard-app.vercel.app,"] }))
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TaskFlow API is running"
  });
});

app.use("/api/tasks", taskRoutes);

app.use(errorMiddleware);

module.exports = app;