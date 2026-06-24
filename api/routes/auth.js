const router = require("express").Router();
const authController = require("../controllers/authController");
const validationRules = require("../validators/authValidator");
const { protect } = require("../middleware/auth");

router.post("/register", validationRules.registerValidationRules, authController.register);
router.post("/login", validationRules.loginValidationRules, authController.login);
router.post("/google", validationRules.googleAuthValidationRules, authController.googleAuth);
router.get("/me", protect, authController.me);

module.exports = router;
