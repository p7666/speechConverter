const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

let latestGesture = null;
let lastUpdated = null;

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

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});