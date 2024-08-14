const Router = require('express').Router;
const router = new Router();
const userRouter = require('./user-router');
const authRouter = require('./auth-router');

router.use('/user', userRouter);
router.use('/auth', authRouter);

module.exports = router;
