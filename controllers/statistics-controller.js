const statisticsService = require('../service/statistics-service');
const Campaign = require('../dtos/campaign-dto');

class StatisticsController {
    async generateForecast(req, res, next) {
        const campaignDto = new Campaign(req.body);
        try {
            const stats = await statisticsService.getStatistics(campaignDto.bannerSize, campaignDto.category);
            const predictions = statisticsService.predictCampaignPerformance(campaignDto.budget, stats);
            return res.json(predictions);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new StatisticsController();
