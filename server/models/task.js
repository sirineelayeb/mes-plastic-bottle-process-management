const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    taskName: {
      type: String,
      required: true,
      trim: true,
    },
    skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
        required: true,
      },
    ],

    machine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Machine",
      required: true,
    },
    dateStart: {
      type: Date,
    },
    dateEnd: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);
