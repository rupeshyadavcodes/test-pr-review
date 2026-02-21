// models/LocationBlock.js

const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  timestamp: Number
});

const LocationBlockSchema = new mongoose.Schema({
  startTime: Number,
  endTime: Number,
  locations: [LocationSchema]
});

// Important index
LocationBlockSchema.index({ startTime: 1, endTime: 1 });

module.exports = mongoose.model('LocationBlock', LocationBlockSchema);
