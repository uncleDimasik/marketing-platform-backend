const Impression = require('../models/impression-model');
const Cache = require('../models/cache-model');

class StatisticsService {
    async getStatistics(bannerSize, category) {


        //кешуемо наразі в монго, потім можно пеїхати на редіс
        const cacheKey = `stats:${bannerSize}:${category}`;

        let cachedData;
        try {
            cachedData = await Cache.findOne({key: cacheKey});
        } catch (error) {
            console.error('Error while fetching cache data:', error);
        }

        if (cachedData) {
            return cachedData.value;
        }

        const impressions = await Impression.aggregate([
            {$match: {banner_size: bannerSize, category: category}},
            {
                $lookup: {
                    from: 'clicks',
                    localField: '_id',
                    foreignField: 'impression_id',
                    as: 'clicks',
                },
            },
            {
                $group: {
                    _id: null,
                    totalImpressions: {$sum: 1},
                    uniqueUsers: {$addToSet: "$user_id"},
                    totalBid: {$sum: "$bid"},
                    totalClicks: {$sum: {$size: '$clicks'}},
                },
            },
            {
                $project: {
                    totalImpressions: 1,
                    uniqueUsers: {$size: "$uniqueUsers"},
                    totalBid: 1,
                    totalClicks: 1,
                },
            },
        ]);

        console.log(impressions);

        const totalImpressions = impressions[0]?.totalImpressions || 0;
        const totalClicks = impressions[0]?.totalClicks || 0;
        const uniqueUsers = impressions[0]?.uniqueUsers || 0;
        const totalBid = impressions[0]?.totalBid || 0;
        const avgBid = totalBid / totalImpressions;

        const result = {
            totalImpressions: totalImpressions,
            totalClicks: totalClicks,
            uniqueUsers: uniqueUsers,
            avgBid: avgBid,
        };


        await Cache.create({key: cacheKey, value: result});

        return result;
    }

    predictCampaignPerformance(budget, stats) {
        const recommendedBid = stats.avgBid;
        const cpm = recommendedBid * 1000;
        const predictedImpressions = (budget / cpm) * 1000;
        const ctr = stats.totalClicks / stats.totalImpressions;
        const predictedClicks = predictedImpressions * ctr;
        const predictedUniqueUsers = (stats.uniqueUsers / stats.totalImpressions) * predictedImpressions;

        return {
            predictedImpressions: Math.round(predictedImpressions),
            predictedClicks: Math.round(predictedClicks),
            predictedUniqueUsers: Math.round(predictedUniqueUsers),
            recommendedBid: recommendedBid,
        };
    }
}


module.exports = new StatisticsService();
