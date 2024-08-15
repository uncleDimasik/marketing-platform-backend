const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');
const statisticsService = require('../service/statistics-service');
const Campaign = require('../dtos/campaign-dto');
const Forecast = require('../dtos/calculated-forecast-dto');
class StatisticsController {
  async generateForecast(req, res, next) {
    try {
      const campaignDto = new Campaign(req.body);

      const { predictedImpressions, cpm } =
        await statisticsService.predictImpressions(
          campaignDto.bannerSize,
          campaignDto.category,
          campaignDto.budget
        );

      console.log(predictedImpressions);

      const { predictedClicks, ctr } =
        await statisticsService.predictClicks(
          campaignDto.bannerSize,
          campaignDto.category,
          predictedImpressions
        );

      const predictedUniq =
        await statisticsService.predictUniqueUsersFromImpressions(
          campaignDto.bannerSize,
          campaignDto.category,
          predictedImpressions
        );

      const recomendedBid =
        await statisticsService.calculateRecommendedBid(
          campaignDto.budget,
          predictedClicks,
          ctr
        );

      const response = {
        impressions: predictedImpressions,
        clicks: predictedClicks,
        uniqueUsers: predictedUniq,
        bid: recomendedBid,
      };
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new StatisticsController();
