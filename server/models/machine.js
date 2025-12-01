const mongoose = require("mongoose");

const machineSchema = new mongoose.Schema(
  {
    idMachine: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["en_service", "en_arret", "en_maintenance"],
      default: "en_arret",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Machine", machineSchema);
