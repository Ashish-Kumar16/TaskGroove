const express = require("express");
const router = express.Router();
const memberController = require("../controllers/memberController");
const auth = require("../middleware/auth");

router.get("/", auth, memberController.getMembers);
router.get("/:id", auth, memberController.getMemberById);
router.post("/", auth, memberController.addMember);
router.put("/:id", auth, memberController.updateMember);
router.delete("/:id", auth, memberController.deleteMember);

module.exports = router;
