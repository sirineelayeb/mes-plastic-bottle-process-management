const Machine = require("../models/machine");

module.exports.createMachine = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    // Count existing documents
    const count = await Machine.countDocuments();

    // Generate new ID (e.g., MCH-001)
    const idMachine = `MCH-${String(count + 1).padStart(3, "0")}`;

    const machine = await Machine.create({
      idMachine,
      name,
      description,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Machine created successfully",
      machine,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all machines
module.exports.getMachines = async (req, res) => {
  try {
    const machines = await Machine.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: machines.length,
      machines,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single machine by Mongo ID
module.exports.getMachineById = async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id);

    if (!machine) {
      return res.status(404).json({
        success: false,
        message: "Machine not found",
      });
    }

    res.status(200).json({
      success: true,
      machine,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update machine
module.exports.updateMachine = async (req, res) => {
  try {
    const machine = await Machine.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!machine) {
      return res.status(404).json({
        success: false,
        message: "Machine not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Machine updated successfully",
      machine,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports.deleteMachine = async (req, res) => {
  try {
    const machine = await Machine.findByIdAndDelete(req.params.id);

    if (!machine) {
      return res.status(404).json({
        success: false,
        message: "Machine not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Machine deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

