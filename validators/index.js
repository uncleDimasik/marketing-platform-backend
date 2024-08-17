const {body} = require('express-validator');

const validateRegistration = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({min: 8, max: 16}).withMessage('Password must be between 8 and 16 characters'),
];

const validateLogin = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password cannot be empty'),
];

const validateForecast = [
    body('bannerSize')
        .isIn(['300x250', '728x90', '160x600', '468x60'])
        .withMessage('Invalid banner size.'),

    body('category')
        .isIn(['Technology', 'Health', 'Finance', 'Education', 'Entertainment'])
        .withMessage('Invalid category.'),

    body('budget')
        .isNumeric()
        .withMessage('Budget must be a number.')
        .isFloat({ min: 10, max: 10000 })
        .withMessage('Budget must be between 10 and 10,000.'),
];

module.exports = {validateForecast,validateLogin, validateRegistration};
