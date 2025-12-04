const express = require("express");
const router = express.Router();

const processController = require("../controllers/process");
const { authenticateToken } = require("../middlewares/auth");
const authorizeRoles = require("../middlewares/verifyRoles");
const ALLOWED_ROLES = require("../config/roles-list");

router.post("/", processController.createProcess);

// Get all processes
router.get("/", processController.getProcesses);
router.get("/current", processController.getCurrentProcess);

// Get a single process by ID
router.get("/:id", processController.getProcessById);

// Update a process (status, tasks, datePlanned)
router.put("/:id", processController.updateProcess);

router.put("/:id/tasks/:taskIndex",authenticateToken,authorizeRoles([ALLOWED_ROLES.OPERATOR]), processController.updateProcessTask);

router.delete("/:id", processController.deleteProcess);

module.exports = router;
