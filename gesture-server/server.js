const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors({
  origin: "*"
}));

app.use(express.json());

let latestGesture = null;
let lastUpdated = null;

// Default route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// POST (ESP32 sends here)
app.post("/gesture", (req, res) => {
  latestGesture = req.body.gesture;
  lastUpdated = Date.now();

  console.log("Gesture:", latestGesture);

  res.json({ message: "Received" });
});

// GET (Frontend reads here)
app.get("/gesture", (req, res) => {
  res.json({
    gesture: latestGesture,
    lastUpdated: lastUpdated
  });
});

// ✅ FIXED PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});