const Process = require("../models/process");
const Task = require("../models/task");
const User = require("../models/user");


module.exports.createProcess = async (req, res) => {
  try {
    const { datePlanned, tasks } = req.body;

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Tasks array must not be empty",
      });
    }

    // Validate each task and operator
    for (const t of tasks) {
      const taskExists = await Task.findById(t.task);
      if (!taskExists) {
        return res.status(404).json({ success: false, message: `Task ${t.task} not found` });
      }

      const operatorExists = await User.findById(t.operator);
      if (!operatorExists) {
        return res.status(404).json({ success: false, message: `Operator ${t.operator} not found` });
      }

      if (operatorExists.role !== "operator") {
        return res.status(400).json({ success: false, message: `User ${t.operator} is not an operator` });
      }
    }

    const process = await Process.create({ datePlanned, tasks });

    res.status(201).json({
      success: true,
      message: "Process created successfully",
      process,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all processes
module.exports.getProcesses = async (req, res) => {
  try {
    const processes = await Process.find()
      .populate("tasks.task", "taskName skills machine")
      .populate("tasks.operator", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: processes.length,
      processes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports.getCurrentProcess = async (req, res) => {
  try {
    const process = await Process.findOne({ status: "in_progress" })
      .sort({ createdAt: -1 })
      .populate({
        path: "tasks.task",
        select: "taskName machine skills",
        populate: {
          path: "skills", // populate the skills of the task
          select: "name", // adjust fields you want from Skill
        },
      })
      .populate({
        path: "tasks.operator",
        select: "name email role skills",
        populate: {
          path: "skills", // populate the skills of the operator
          select: "name", // adjust fields you want from Skill
        },
      });

    res.status(200).json({
      success: true,
      process,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get a single process by ID
module.exports.getProcessById = async (req, res) => {
  try {
    const process = await Process.findById(req.params.id)
      .populate("tasks.task", "taskName skills machine")
      .populate("tasks.operator", "name email role");

    if (!process) {
      return res.status(404).json({ success: false, message: "Process not found" });
    }

    res.status(200).json({ success: true, process });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update process (status or tasks)
module.exports.updateProcess = async (req, res) => {
  try {
    const { datePlanned, status, tasks } = req.body;

    const updateData = {};
    if (datePlanned) updateData.datePlanned = datePlanned;
    if (status) updateData.status = status;
    if (tasks) {
      if (!Array.isArray(tasks) || tasks.length === 0) {
        return res.status(400).json({ success: false, message: "Tasks array must not be empty" });
      }

      // Validate tasks and operators
      for (const t of tasks) {
        const taskExists = await Task.findById(t.task);
        if (!taskExists) return res.status(404).json({ success: false, message: `Task ${t.task} not found` });

        const operatorExists = await User.findById(t.operator);
        if (!operatorExists) return res.status(404).json({ success: false, message: `Operator ${t.operator} not found` });
        if (operatorExists.role !== "operator") {
          return res.status(400).json({ success: false, message: `User ${t.operator} is not an operator` });
        }
      }

      updateData.tasks = tasks;
    }

    const process = await Process.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("tasks.task", "taskName skills machine")
      .populate("tasks.operator", "name email role");

    if (!process) return res.status(404).json({ success: false, message: "Process not found" });

    res.status(200).json({ success: true, message: "Process updated", process });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a single task inside a process
module.exports.updateProcessTask = async (req, res) => {
  try {
    const { taskIndex } = req.params;
    const { status, operator } = req.body;

    const process = await Process.findById(req.params.id);
    if (!process) return res.status(404).json({ success: false, message: "Process not found" });

    const taskItem = process.tasks[taskIndex];
    if (!taskItem) return res.status(400).json({ success: false, message: "Invalid task index" });

    // If trying to update status, confirm the current user is the assigned operator
    if (status) {
      if (!["pending", "in_progress", "done"].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status value" });
      }

      if (taskItem.operator.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "You are not allowed to update the status of this task",
        });
      }

      taskItem.status = status;
    }

    // Allow updating operator only by admin or process owner (optional)
    if (operator) {
      const operatorExists = await User.findById(operator);
      if (!operatorExists) return res.status(404).json({ success: false, message: "Operator not found" });
      if (operatorExists.role !== "operator") return res.status(400).json({ success: false, message: "User is not an operator" });

      taskItem.operator = operator;
    }

    await process.save();

    const populatedProcess = await Process.findById(req.params.id)
      .populate("tasks.task", "taskName skills machine")
      .populate("tasks.operator", "name email role");

    res.status(200).json({ success: true, message: "Task updated", process: populatedProcess });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Delete a process
module.exports.deleteProcess = async (req, res) => {
  try {
    const process = await Process.findByIdAndDelete(req.params.id);
    if (!process) return res.status(404).json({ success: false, message: "Process not found" });

    res.status(200).json({ success: true, message: "Process deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
