const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");

// ✅ Create new reservation
router.post("/", async (req, res) => {
  try {
    const { name, phone, email, partySize, date, tableNumber, notes } = req.body;

    if (!name || !phone || !partySize || !date) {
      return res.status(400).json({ message: "Name, phone, party size, and date are required." });
    }

    const reservation = new Reservation({
      name,
      phone,
      email,
      partySize,
      date: new Date(date),
      tableNumber,
      notes
    });

    const saved = await reservation.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error creating reservation:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// ✅ Get all reservations (optionally filter by date)
router.get("/", async (req, res) => {
  try {
    const { date } = req.query;
    const filter = {};

    if (date) {
      const d = new Date(date);
      const next = new Date(d);
      next.setDate(d.getDate() + 1);
      filter.date = { $gte: d, $lt: next };
    }

    const reservations = await Reservation.find(filter).sort({ date: 1 });
    res.json(reservations);
  } catch (err) {
    console.error("Error fetching reservations:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// ✅ Get single reservation by ID
router.get("/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Reservation not found." });
    res.json(reservation);
  } catch (err) {
    console.error("Error fetching reservation:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// ✅ Update reservation
router.put("/:id", async (req, res) => {
  try {
    const updated = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: "Reservation not found." });
    res.json(updated);
  } catch (err) {
    console.error("Error updating reservation:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// ✅ Delete reservation
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Reservation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Reservation not found." });
    res.json({ message: "Reservation deleted successfully." });
  } catch (err) {
    console.error("Error deleting reservation:", err);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
