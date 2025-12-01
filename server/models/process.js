const mongoose = require("mongoose");

const processTaskSchema = new mongoose.Schema({
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  operator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["pending", "in_progress", "done"],
    default: "pending",
  },
}, { _id: false });

const processSchema = new mongoose.Schema({
  datePlanned: { type: Date, required: true },

  status: {
    type: String,
    enum: ["planned", "in_progress", "completed", "cancelled"],
    default: "planned",
  },

  tasks: [processTaskSchema]

}, { timestamps: true });

module.exports = mongoose.model("Process", processSchema);
