const express = require('express');
const router = express.Router();
const statisticsController = require('../../controllers/statistics-controller');
const authMiddleware = require('../../middlewares/auth-middleware');
const {validateForecast} = require("../../validators");
const handleValidationErrors = require("../../middlewares/validation-middleware");

router.post(
    '/forecast',
    authMiddleware,
    validateForecast,
    handleValidationErrors,
    statisticsController.generateForecast
);

module.exports = router;
