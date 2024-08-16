const { body } = require('express-validator');

const validateRegistration = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 3, max: 32 }).withMessage('Password must be between 3 and 32 characters'),
];

const validateLogin = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password cannot be empty'),
];

module.exports = { validateLogin, validateRegistration };
