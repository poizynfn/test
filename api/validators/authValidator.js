const { body } = require("express-validator");

const registerValidationRules = [
    body("email").isEmail().withMessage("A valid email is required").normalizeEmail(),
    body("password").isString().withMessage("Password must be a string").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];

const loginValidationRules = [body("email").isEmail().withMessage("A valid email is required").normalizeEmail(), body("password").isString().withMessage("Password must be a string").notEmpty().withMessage("Password is required")];

const googleAuthValidationRules = [body("credential").isString().withMessage("Google credential is required").notEmpty().withMessage("Google credential is required")];

module.exports = {
    registerValidationRules,
    loginValidationRules,
    googleAuthValidationRules,
};
