const { Schema, model } = require("mongoose");

const reservationSchema = new Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, trim: true },
  partySize: { type: Number, required: true, min: 1 },
  date: { type: Date, required: true },
  tableNumber: { type: Number },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = model("Reservation", reservationSchema);
