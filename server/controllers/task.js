const Task = require("../models/task");
const Skill = require("../models/skill");
const Machine = require("../models/machine");

// Create Task
module.exports.createTask = async (req, res) => {
  try {
    const { taskName, skills, machine, dateStart, dateEnd, operators } = req.body;

    // Validate skills array
    if (!Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Skills must be a non-empty array",
      });
    }

    // Validate machine existence
    const machineExists = await Machine.findById(machine);
    if (!machineExists) {
      return res.status(404).json({
        success: false,
        message: "Machine not found",
      });
    }

    // Validate each skill ID
    const skillsExist = await Skill.find({ _id: { $in: skills } });

    if (skillsExist.length !== skills.length) {
      return res.status(400).json({
        success: false,
        message: "One or more skills do not exist",
      });
    }

    // Remove duplicates (safety)
    const uniqueSkills = [...new Set(skills)];

    const task = await Task.create({
      taskName,
      skills: uniqueSkills,
      machine,dateStart ,dateEnd ,operators
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Tasks
module.exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("skills", "name description")
      .populate("machine", "idMachine name status")
        .populate("operators", "name") 
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a Task by ID
module.exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("skills", "name description")
      .populate("machine", "idMachine name status")
      .populate("operators", "name"); 
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Task
module.exports.updateTask = async (req, res) => {
  try {
    const { taskName, skills, machine } = req.body;

    // If machine is updated, validate it
    if (machine) {
      const machineExists = await Machine.findById(machine);
      if (!machineExists) {
        return res.status(404).json({
          success: false,
          message: "Machine not found",
        });
      }
    }

    // If skills are updated, validate the array
    if (skills) {
      if (!Array.isArray(skills) || skills.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Skills must be a non-empty array",
        });
      }

      const skillsExist = await Skill.find({ _id: { $in: skills } });
      if (skillsExist.length !== skills.length) {
        return res.status(400).json({
          success: false,
          message: "One or more skills do not exist",
        });
      }

      req.body.skills = [...new Set(skills)]; // Remove duplicates
    }

    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("skills", "name description")
      .populate("machine", "idMachine name status");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Task
module.exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get number of tasks with status "In Progress"
module.exports.getTasksInProgressCount = async (req, res) => {
  try {
    const count = await Task.countDocuments({ status: "In Progress" });
    res.status(200).json({ success: true, tasksInProgress: count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Get number of tasks with status "Completed"
module.exports.getTasksCompletedCount = async (req, res) => {
  try {
    const count = await Task.countDocuments({ status: "Completed" });
    res.status(200).json({ success: true, tasksCompleted: count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get number of tasks with status "Pending"
module.exports.getTasksPendingCount = async (req, res) => {
  try {
    const count = await Task.countDocuments({ status: "Pending" });
    res.status(200).json({ success: true, tasksPending: count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get number of operators assigned / unassigned to any task
module.exports.getOperatorsAssignmentStats = async (req, res) => {
  try {
    // All tasks with operators
    const tasks = await Task.find().select("operators");
    const assignedOperatorIds = new Set(tasks.flatMap(t => t.operators.map(op => op.toString())));

    const allOperators = await Operator.find().select("_id name");
    const operatorsAssigned = allOperators.filter(op => assignedOperatorIds.has(op._id.toString())).length;
    const operatorsUnassigned = allOperators.length - operatorsAssigned;

    res.status(200).json({
      success: true,
      operatorsAssigned,
      operatorsUnassigned,
      totalOperators: allOperators.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Optional: Total tasks count
module.exports.getTotalTasksCount = async (req, res) => {
  try {
    const count = await Task.countDocuments();
    res.status(200).json({ success: true, totalTasks: count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

