const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const auth = require("../middleware/auth");

router.get("/", auth, taskController.getTasks);
router.get('/assigned', auth, taskController.getAssignedTasks);
router.get("/:id", auth, taskController.getTaskById);
router.post("/", auth, taskController.createTask);
router.put("/:id", auth, taskController.updateTask);
router.delete("/:id", auth, taskController.deleteTask);
module.exports = router;
