const router = require("express").Router();
const roomController = require("../controllers/roomController");
const validationRules = require("../validators/roomValidator");
const { protect } = require("../middleware/auth");

router.post("/create", protect, validationRules.createRoomValidationRules, roomController.create);
router.post("/join", protect, validationRules.joinRoomValidationRules, roomController.join);

module.exports = router;
