require('dotenv').config();
const {clickhouseClient: clClient} = require("../storage/clickhouse");

// Настройка клиента ClickHouse
const clickhouseClient = clClient;

class StatisticsService {
    async getStatistics(bannerSize, category) {
        const query = `
            SELECT
              COUNT() AS totalImpressions,
              uniq(user_id) AS uniqueUsers,
              SUM(bid) AS totalBid,
              COUNT(clicks.impression_id) AS totalClicks
            FROM impressions AS fi
            LEFT JOIN clicks AS c
              ON fi.impression_id = c.impression_id
            WHERE
              fi.banner_size = '${bannerSize}' AND
              fi.category = '${category}'
        `;

        let impressionsQuery;
        try {
            impressionsQuery = await clickhouseClient.query({
                query,
                format: 'JSONEachRow',
                params: {bannerSize, category}
            });
        } catch (error) {
            console.error('Error querying ClickHouse:', error);
            throw error;
        }

        const impressions = await impressionsQuery.json();
        const [result] = impressions;

        const totalImpressions = result?.totalImpressions || 0;
        const totalClicks = result?.totalClicks || 0;
        const uniqueUsers = result?.uniqueUsers || 0;
        const totalBid = result?.totalBid || 0;
        const avgBid = totalImpressions > 0 ? totalBid / totalImpressions : 0;

        return {
            totalImpressions,
            totalClicks,
            uniqueUsers,
            avgBid
        };
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
            recommendedBid
        };
    }
}

module.exports = new StatisticsService();
