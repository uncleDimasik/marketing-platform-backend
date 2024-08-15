const Router = require('express').Router;
const router = new Router();
const userRouter = require('./user-router');
const authRouter = require('./auth-router');
const statisticsRouter = require('./statistics-router');

router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/statistics', statisticsRouter);

module.exports = router;
