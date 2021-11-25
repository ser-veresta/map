const mongoose = require("mongoose");

const CountSchema = new mongoose.Schema({
  count: {
    type: Number,
    default: 0,
  },
  timeOut: {
    type: Date,
  },
});

exports.Count = mongoose.model("count", CountSchema);
