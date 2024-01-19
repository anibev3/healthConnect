const mongoose = require("mongoose");

const Appointment = mongoose.model(
  "Appointment",
  new mongoose.Schema({
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    notes: { type: String },
    additionalNotes: {
      type: String,
      required: false,
    },
    validatedBy: {
      type: String,
      required: false,
    },
    validatedAt: {
      type: Date,
      required: false,
    },
  })
);

module.exports = Appointment;
