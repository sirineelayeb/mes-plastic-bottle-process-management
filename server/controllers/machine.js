const Machine = require("../models/machine");

module.exports.createMachine = async (req, res) => {
  try {
    const { name, description = "", status = "en_arret" } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Machine name is required" });
    }

    // Ensure status is valid
    const allowedStatuses = ["en_service", "en_arret", "en_maintenance"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    // Generate unique idMachine
    const idMachine = `MCH-${Date.now().toString().slice(-6)}`;

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
    console.error("Create Machine Error:", error);
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

// -------------------- Dashboard Metrics for Machines --------------------

// Get total machines count
module.exports.getTotalMachinesCount = async (req, res) => {
  try {
    const count = await Machine.countDocuments();
    res.status(200).json({ success: true, totalMachines: count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get machines count by status
module.exports.getMachinesCountByStatus = async (req, res) => {
  try {
    const statusCounts = await Machine.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Convert array to object { status: count }
    const counts = statusCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    res.status(200).json({ success: true, counts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};