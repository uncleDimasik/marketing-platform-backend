const Router = require('express').Router;
const userController = require('../../controllers/user-controller');
const router = new Router();
const authMiddleware = require('../../middlewares/auth-middleware');

router.get('/users', authMiddleware, userController.getUsers);
router.get('/whoAmI', authMiddleware, userController.whoAmI);

module.exports = router;
