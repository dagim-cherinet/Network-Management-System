const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  userID: String,
  name: {
    type: String,
    // required: [true, 'must provide name'],
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  accepted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Task", TaskSchema);
