const express = require('express');
const router = express.Router();
const statisticsController = require('../../controllers/statistics-controller');
const authMiddleware = require('../../middlewares/auth-middleware');

router.post(
  '/forecast',
  authMiddleware,
  statisticsController.generateForecast
);

module.exports = router;
