const Process = require("../models/process");
const Task = require("../models/task");
const User = require("../models/user");

module.exports.getCompletedTasksToday = async (req, res) => {
  try {
    const { operatorId } = req.params;

    if (!operatorId) {
      return res.status(400).json({ success: false, message: "Operator ID is required" });
    }

    // Define today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0); // start of today
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // start of next day

    // Find all processes containing tasks for this operator
    const processes = await Process.find({ "tasks.operator": operatorId });

    let completedCount = 0;

    processes.forEach(proc => {
      proc.tasks.forEach(t => {
        if (
          t.operator.toString() === operatorId &&
          t.status === "done" &&
          t.endTime >= today && t.endTime < tomorrow
        ) {
          completedCount++;
        }
      });
    });

    res.status(200).json({ success: true, totalCompletedToday: completedCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports.getTasksByOperatorFiltered = async (req, res) => {
  try {
    const { operatorId } = req.params;

    // Find all processes that have tasks assigned to this operator
    const processes = await Process.find({ "tasks.operator": operatorId, processStatus: "in_progress" })
      .populate("tasks.task", "taskName skills machine") // populate task details
      .populate("tasks.operator", "name email role"); // populate operator details if needed

    // Flatten tasks for this operator across all processes
    const tasks = processes.flatMap((process) =>
      process.tasks
        .filter((t) => t.operator.toString() === operatorId)
        .map((t) => ({
          ...t.toObject(),
          processId: process._id,
          processStatus: process.status,
          datePlanned: process.datePlanned,
        }))
    );

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports.getTasksByOperatorFilteredAll = async (req, res) => {
  try {
    const { operatorId } = req.params;
    console.log(operatorId)

    const processes = await Process.find({ "tasks.operator": operatorId })
      .populate("tasks.task", "taskName skills machine") // populate task details
      .populate("tasks.operator", "name email role"); // populate operator details if needed

    // Flatten tasks for this operator across all processes
    const tasks = processes.flatMap((process) =>
      process.tasks
        .filter((t) => t.operator.toString() === operatorId)
        .map((t) => ({
          ...t.toObject(),
          processId: process._id,
          processStatus: process.status,
          datePlanned: process.datePlanned,
        }))
    );

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports.getTasksByOperator = async (req, res) => {
  try {
    const operatorId = req.params.operatorId;

    // Find all processes that contain tasks assigned to this operator
    const processes = await Process.find({ "tasks.operator": operatorId })
      .populate({
        path: "tasks.task",
        select: "taskName taskDescription duration machine skills",
        populate: [
          { path: "machine", select: "name status" },
          { path: "skills", select: "name" }
        ]
      })
      .populate({
        path: "tasks.operator",
        select: "name email role"
      })
      .sort({ datePlanned: -1 });

    // Flatten tasks: only include tasks assigned to this operator
    const operatorTasks = [];

    processes.forEach(proc => {
      proc.tasks.forEach(t => {
        if (t.operator._id.toString() === operatorId) {
         operatorTasks.push({
          processId: proc._id,
          processName: proc.name || `Process ${proc._id}`,
          processStatus: proc.status,
          datePlanned: proc.datePlanned,
          taskId: t.task._id,
          taskName: t.task.taskName,
          taskDescription: t.task.taskDescription,
          duration: t.task.duration,
          machine: t.task.machine, // single machine now
          skills: t.task.skills,
          operator: t.operator,
          status: t.status,
          startTime: t.startTime,
          endTime: t.endTime
        });

        }
      });
    });

    res.status(200).json({ success: true, count: operatorTasks.length, tasks: operatorTasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};



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
      .populate({
        path: "tasks.task",
        select: "taskName machine skills",
        populate: {
          path: "skills",
          select: "name", 
        },
      })
      .populate({
        path: "tasks.operator",
        select: "name email role skills",
        populate: {
          path: "skills", 
          select: "name",
        },
      })
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

module.exports.updateTaskStatus = async (req, res) => {
  try {
    const { operatorId, taskId, status } = req.body;

    // Validate status
    console.log(operatorId, taskId, status)
    const validStatuses = ["pending", "in_progress", "done"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    // Find the process containing this task for this operator
    const process = await Process.findOne({
      "tasks.task": taskId,
      "tasks.operator": operatorId,
    });

    if (!process) {
      return res.status(404).json({ message: "Task not found for this operator." });
    }

    // Update the status and optionally timestamps
    process.tasks = process.tasks.map((t) => {
      if (t.task.toString() === taskId && t.operator.toString() === operatorId) {
        t.status = status;
        if (status === "in_progress") t.startTime = new Date();
        if (status === "done") t.endTime = new Date();
      }
      return t;
    });

    await process.save();

    res.status(200).json({ message: "Task status updated successfully.", process });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
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

// GET /api/process/tasks/operator/:operatorId
module.exports.getTasksByOperator = async (req, res) => {
  try {
    const operatorId = req.params.operatorId;

    // Find all processes that contain tasks assigned to this operator
    const processes = await Process.find({ "tasks.operator": operatorId })
      .populate({
        path: "tasks.task",
        select: "taskName taskDescription duration machine skills",
        populate: [
          { path: "machine", select: "name status" },
          { path: "skills", select: "name" }
        ]
      })
      .populate({
        path: "tasks.operator",
        select: "name email role"
      })
      .sort({ datePlanned: -1 });

    // Flatten tasks: only include tasks assigned to this operator
    const operatorTasks = [];

    processes.forEach(proc => {
      proc.tasks.forEach(t => {
        if (t.operator._id.toString() === operatorId) {
         operatorTasks.push({
          processId: proc._id,
          processName: proc.name || `Process ${proc._id}`,
          processStatus: proc.status,
          datePlanned: proc.datePlanned,
          taskId: t.task._id,
          taskName: t.task.taskName,
          taskDescription: t.task.taskDescription,
          duration: t.task.duration,
          machine: t.task.machine, // single machine now
          skills: t.task.skills,
          operator: t.operator,
          status: t.status,
          startTime: t.startTime,
          endTime: t.endTime
        });

        }
      });
    });

    res.status(200).json({ success: true, count: operatorTasks.length, tasks: operatorTasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /process/:taskId/task-status
module.exports.updateTaskStatusByOperator = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const userId = req.user?._id;

    const VALID_STATUSES = ["pending", "in_progress", "done", "paused"];
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const process = await Process.findOne({ "tasks._id": taskId });
    if (!process) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    const taskItem = process.tasks.find(t => t._id.toString() === taskId);
    if (!taskItem) {
      return res.status(404).json({ success: false, message: "Task not found in process" });
    }

    if (taskItem.operator.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }

    taskItem.status = status;

    if (status === "in_progress") taskItem.startTime = taskItem.startTime || new Date();
    if (status === "done") taskItem.endTime = new Date();

    await process.save();

    res.status(200).json({ success: true, message: "Task status updated", task: taskItem });
  } catch (err) {
    console.error("Error updating task status:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// GET /api/process/tasks/operator/:operatorId?status=&machineName=
module.exports.getTasksByOperatorFiltered = async (req, res) => {
  try {
    const { operatorId } = req.params;
    const { status, machineName } = req.query; // Optional filters

    // Get all processes where this operator has tasks
    const processes = await Process.find({ "tasks.operator": operatorId })
      .populate({
        path: "tasks.task",
        select: "taskName taskDescription duration machine skills",
        populate: { path: "machine", select: "name status" } // populate machine details
      })
      .populate("tasks.operator", "name email role")
      .sort({ datePlanned: -1 });

    const tasks = [];

    processes.forEach(proc => {
      proc.tasks.forEach(t => {
        // Only include tasks assigned to this operator
        if (t.operator._id.toString() !== operatorId) return;

        // Apply optional filters
        if (status && t.status !== status) return;
        if (machineName && t.task.machine?.name.toLowerCase().indexOf(machineName.toLowerCase()) === -1) return;

        tasks.push({
          processId: proc._id,
          processName: proc.name || `Process ${proc._id}`, // fallback if no name field
          processStatus: proc.status,
          datePlanned: proc.datePlanned,
          taskId: t.task._id,
          taskName: t.task.taskName,
          taskDescription: t.task.taskDescription,
          duration: t.task.duration,
          machine: t.task.machine, // single machine
          skills: t.task.skills,
          operator: t.operator,
          status: t.status,
          startTime: t.startTime,
          endTime: t.endTime
        });
      });
    });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /process/tasks/:taskId/task-status
module.exports.updateTaskStatusByOperator = async (req, res) => {
  try {
    const { taskId } = req.params; // this is Task._id
    const { status } = req.body;
    const userId = req.user._id;

    // Find process containing this task assigned to this operator
    const process = await Process.findOne({ "tasks.task": taskId });
    if (!process) return res.status(404).json({ success: false, message: "Task not found" });

    // Find the task subdocument
    const taskItem = process.tasks.find(t => t.task.toString() === taskId);
    if (!taskItem) return res.status(404).json({ success: false, message: "Task not found in process" });

    // Check operator
    if (taskItem.operator.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }

    // Update status
    taskItem.status = status;
    if (status === "in_progress") taskItem.startTime = taskItem.startTime || new Date();
    if (status === "done") taskItem.endTime = new Date();

    await process.save();

    res.status(200).json({ success: true, message: "Task status updated", task: taskItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};



// GET /api/process/tasks/completed-today/:operatorId
module.exports.getCompletedTasksToday = async (req, res) => {
  try {
    const { operatorId } = req.params;

    if (!operatorId) {
      return res.status(400).json({ success: false, message: "Operator ID is required" });
    }

    // Define today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0); // start of today
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // start of next day

    // Find all processes containing tasks for this operator
    const processes = await Process.find({ "tasks.operator": operatorId });

    let completedCount = 0;

    processes.forEach(proc => {
      proc.tasks.forEach(t => {
        if (
          t.operator.toString() === operatorId &&
          t.status === "done" &&
          t.endTime >= today && t.endTime < tomorrow
        ) {
          completedCount++;
        }
      });
    });

    res.status(200).json({ success: true, totalCompletedToday: completedCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// Count tasks with status pending or in_progress for the current week
module.exports.getPendingOrInProgressTasksThisWeek = async (req, res) => {
  try {
    const { operatorId } = req.params;

    // Get start and end of the current week (Sunday to Saturday)
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Fetch all processes containing tasks assigned to this operator
    const processes = await Process.find({ "tasks.operator": operatorId });

    let count = 0;

    processes.forEach(proc => {
      proc.tasks.forEach(t => {
        const taskEndTime = t.endTime ? new Date(t.endTime) : null;
        if (
          t.operator.toString() === operatorId &&
          (t.status === "pending" || t.status === "in_progress") &&
          taskEndTime &&
          taskEndTime >= startOfWeek &&
          taskEndTime <= endOfWeek
        ) {
          count++;
        }
      });
    });

    res.status(200).json({ success: true, totalPendingOrInProgressThisWeek: count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Count tasks with status pending or in_progress for the current month
module.exports.getPendingOrInProgressTasksThisMonth = async (req, res) => {
  try {
    const { operatorId } = req.params;

    const now = new Date();

    // Start of current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    // End of current month
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    // Fetch all processes containing tasks assigned to this operator
    const processes = await Process.find({ "tasks.operator": operatorId });

    let count = 0;

    processes.forEach(proc => {
      proc.tasks.forEach(t => {
        const taskEndTime = t.endTime ? new Date(t.endTime) : null;
        if (
          t.operator.toString() === operatorId &&
          (t.status === "pending" || t.status === "in_progress") &&
          taskEndTime &&
          taskEndTime >= startOfMonth &&
          taskEndTime <= endOfMonth
        ) {
          count++;
        }
      });
    });

    res.status(200).json({ success: true, totalPendingOrInProgressThisMonth: count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};





// GET /process/tasks/first-completed/:operatorId
module.exports.getStartDateOfFirstCompletedTask = async (req, res) => {
  try {
    const { operatorId } = req.params;

    if (!operatorId) {
      return res.status(400).json({ 
        success: false, 
        message: "Operator ID is required" 
      });
    }

    // Find all processes containing tasks for this operator
    const processes = await Process.find({ "tasks.operator": operatorId });

    let firstStartTime = null;

    processes.forEach(proc => {
      proc.tasks.forEach(t => {
        if (
          t.operator.toString() === operatorId &&
          t.status === "done" &&
          t.startTime
        ) {
          // If firstStartTime is null or this task started earlier
          if (!firstStartTime || t.startTime < firstStartTime) {
            firstStartTime = t.startTime;
          }
        }
      });
    });

    if (!firstStartTime) {
      return res.status(404).json({ 
        success: false, 
        message: "No completed tasks found for this operator" 
      });
    }

    res.status(200).json({ 
      success: true, 
      firstCompletedTaskStartDate: firstStartTime 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// GET /process/tasks/last-completed/:operatorId
module.exports.getEndDateOfLastCompletedTask = async (req, res) => {
  try {
    const { operatorId } = req.params;

    if (!operatorId) {
      return res.status(400).json({ 
        success: false, 
        message: "Operator ID is required" 
      });
    }

    // Find all processes containing tasks for this operator
    const processes = await Process.find({ "tasks.operator": operatorId });

    let lastEndTime = null;

    processes.forEach(proc => {
      proc.tasks.forEach(t => {
        if (
          t.operator.toString() === operatorId &&
          t.status === "done" &&
          t.endTime
        ) {
          // If lastEndTime is null or this task ended later
          if (!lastEndTime || t.endTime > lastEndTime) {
            lastEndTime = t.endTime;
          }
        }
      });
    });

    if (!lastEndTime) {
      return res.status(404).json({ 
        success: false, 
        message: "No completed tasks found for this operator" 
      });
    }

    res.status(200).json({ 
      success: true, 
      lastCompletedTaskEndDate: lastEndTime 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};






module.exports.getTasksByOperatorFiltered = async (req, res) => {
  try {
    const { operatorId } = req.params;
    const { status, machineName } = req.query; // Optional filters

    // Get all processes where this operator has tasks
    const processes = await Process.find({ "tasks.operator": operatorId })
      .populate({
        path: "tasks.task",
        select: "taskName taskDescription duration machine skills",
        populate: [
          { 
            path: "machine", 
            select: "idMachine name description status" // Corrected: removed temperature/pressure
          },
          { 
            path: "skills", 
            select: "name" 
          }
        ]
      })
      .populate("tasks.operator", "name email role skills")
      .sort({ datePlanned: -1 });

    const tasks = [];

    processes.forEach(proc => {
      proc.tasks.forEach(t => {
        // Only include tasks assigned to this operator
        if (t.operator._id.toString() !== operatorId) return;

        // Apply optional filters
        if (status && t.status !== status) return;
        if (machineName && t.task.machine?.name.toLowerCase().indexOf(machineName.toLowerCase()) === -1) return;

        // Calculate real-time progress
        let timeElapsed = 0;
        let progress = 0;

        if (t.startTime) {
          const startTime = new Date(t.startTime).getTime();
          const now = new Date().getTime();
          timeElapsed = Math.floor((now - startTime) / (1000 * 60)); // minutes
        }

        if (t.task.duration && timeElapsed > 0) {
          progress = Math.min(Math.round((timeElapsed / t.task.duration) * 100), 100);
        }

        tasks.push({
          // Task subdocument doesn't have _id since _id: false
          processId: proc._id,
          processName: proc.name || `Process ${proc._id}`,
          processStatus: proc.status,
          datePlanned: proc.datePlanned,
          
          // Task details
          taskId: t.task._id,
          taskName: t.task.taskName,
          taskDescription: t.task.taskDescription,
          duration: t.task.duration,
          machine: t.task.machine, // Contains: idMachine, name, description, status
          skills: t.task.skills,
          
          // Operator and status
          operator: t.operator,
          status: t.status,
          startTime: t.startTime,
          endTime: t.endTime,
          
          // Calculated fields
          timeElapsed,
          estimatedDuration: t.task.duration,
          progress,
          
          // Legacy fields for backward compatibility
          id: t.task._id,
          label: t.task.taskName,
          product: proc.name || "Process"
        });
      });
    });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// get machines status by operator
module.exports.getMachinesStatusByOperator = async (req, res) => {
try {
const { operatorId } = req.params;


if (!operatorId) {
  return res.status(400).json({ success: false, message: "Operator ID is required" });
}

// Fetch all processes with tasks assigned to this operator
const processes = await Process.find({ "tasks.operator": operatorId })
  .populate({
    path: "tasks.task",
    select: "taskName machine",
    populate: { path: "machine", select: "name status" }
  });

const machinesMap = new Map();

processes.forEach(proc => {
  proc.tasks.forEach(t => {
    if (t.operator.toString() === operatorId && t.task.machine) {
      const machineId = t.task.machine._id.toString();
      // Avoid duplicates; always keep latest status
      machinesMap.set(machineId, {
        machineId,
        name: t.task.machine.name,
        status: t.task.machine.status,
        taskId: t.task._id,
        taskName: t.task.taskName,
        processId: proc._id,
        processName: proc.name || `Process ${proc._id}`
      });
    }
  });
});

const machines = Array.from(machinesMap.values());

res.status(200).json({ success: true, count: machines.length, machines });

} catch (error) {
console.error(error);
res.status(500).json({ success: false, message: error.message });
}
};







// module.exports.listOperatorTasks = async (req, res) => {
//   try {
//     const processes = await Process.find()
//       .populate("tasks.task", "taskName")
//       .populate("tasks.operator", "name");

//     const tasksList = [];
//     processes.forEach(proc => {
//       proc.tasks.forEach(t => {
//        tasksList.push({
//   taskIdInProcessArray: t._id, // ← THIS is what you PATCH
//   taskName: t.task.taskName,
//   operatorName: t.operator.name,
//   status: t.status
// });

//       });
//     });

//     res.json({ success: true, tasksList });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

