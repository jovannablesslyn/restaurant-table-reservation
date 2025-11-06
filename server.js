const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Serve static files (index.html, style.css, etc.) from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Import routes
const reservationRoutes = require("./routes/reservations");
app.use("/api/reservations", reservationRoutes);

// Catch-all: serve index.html for all non-API, non-file requests (for SPA support)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/restaurant_reservations";
const PORT = process.env.PORT || 4000;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
