const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['holiday', 'payment', 'check', 'meeting', 'other'], required: true },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);