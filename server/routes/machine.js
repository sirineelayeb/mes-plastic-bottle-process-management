const express = require("express");
const router = express.Router();
const machineController = require("../controllers/machine");

router.post("/", machineController.createMachine);
router.get("/", machineController.getMachines);
router.get("/:id", machineController.getMachineById);
router.put("/:id", machineController.updateMachine);
router.delete("/:id", machineController.deleteMachine);

module.exports = router;
