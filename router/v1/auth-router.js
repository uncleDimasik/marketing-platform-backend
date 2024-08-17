const Router = require('express').Router;
const authController = require('../../controllers/auth-controller');
const router = new Router();
const {validateRegistration, validateLogin} = require('../../validators');
const handleValidationErrors = require('../../middlewares/validation-middleware');

router.post(
    '/registration',
    validateRegistration,
    handleValidationErrors,
    authController.registration
);
router.post('/login',
    validateLogin,
    handleValidationErrors,
    authController.login);
router.post('/logout', authController.logout);
router.get('/refresh', authController.refresh);

module.exports = router;
