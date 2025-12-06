const express = require("express");
const router = express.Router();

const processController = require("../controllers/process");
const { authenticateToken } = require("../middlewares/auth");
const authorizeRoles = require("../middlewares/verifyRoles");
const ALLOWED_ROLES = require("../config/roles-list");

router.get("/tasks/operator/all/:operatorId", authenticateToken,authorizeRoles([ALLOWED_ROLES.OPERATOR]), processController.getTasksByOperator);
router.post("/", processController.createProcess);
router.put("/task/:taskId/task-status", processController.updateTaskStatus);

// Get all processes
router.get("/", processController.getProcesses);
router.get("/current", processController.getCurrentProcess);

// Get a single process by ID
router.get("/:id", processController.getProcessById);

// Update a process (status, tasks, datePlanned)
router.put("/:id", processController.updateProcess);

router.put("/:id/tasks/:taskIndex",authenticateToken,authorizeRoles([ALLOWED_ROLES.OPERATOR]), processController.updateProcessTask);
router.get("/tasks/operator/:operatorId", authenticateToken,authorizeRoles([ALLOWED_ROLES.OPERATOR]), processController.getTasksByOperator);

router.delete("/:id", processController.deleteProcess);


router.get("/tasks/operator/:operatorId", authenticateToken,authorizeRoles([ALLOWED_ROLES.OPERATOR]), processController.getTasksByOperator);
router.get(
  "/tasks/completed-today/:operatorId",
  authenticateToken, 
  processController.getCompletedTasksToday
);

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













router.get("/tasks/operator/:operatorId", authenticateToken,authorizeRoles([ALLOWED_ROLES.OPERATOR]), processController.getTasksByOperatorFiltered);


// Update task status by operator



// Count completed tasks today for a specific operator
router.get(
  "/tasks/completed-today/:operatorId",
  authenticateToken, 
  processController.getCompletedTasksToday
);
// Count pending or in-progress tasks in the current week for a specific operator
router.get(
  "/tasks/pending-inprogress-week/:operatorId",
  authenticateToken,
  authorizeRoles([ALLOWED_ROLES.OPERATOR]),
  processController.getPendingOrInProgressTasksThisWeek
);

// Count pending or in-progress tasks in the current month for a specific operator
router.get(
  "/tasks/pending-inprogress-month/:operatorId",
  authenticateToken,
  authorizeRoles([ALLOWED_ROLES.OPERATOR]),
  processController.getPendingOrInProgressTasksThisMonth
);

router.get('/tasks/first-completed/:operatorId', processController.getStartDateOfFirstCompletedTask);
router.get('/tasks/last-completed/:operatorId', processController.getEndDateOfLastCompletedTask);

router.get('/machines-status/:operatorId', authenticateToken, authorizeRoles([ALLOWED_ROLES.OPERATOR]), processController.getMachinesStatusByOperator);



module.exports = router;
