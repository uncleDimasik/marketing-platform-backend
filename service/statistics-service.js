const Impression = require('../models/impression-model');
const Click = require('../models/click-model');
class StatisticsService {
  calculateCPM = async (bannerSize, category) => {
    const [result] = await Impression.aggregate([
      {
        $match: { banner_size: bannerSize, category: category },
      },
      {
        $group: {
          _id: null,
          totalCost: { $sum: '$bid' },
          totalImpressions: { $count: {} },
        },
      },
      {
        $project: {
          _id: 0,
          cpm: {
            $cond: [
              { $ne: ['$totalImpressions', 0] },
              {
                $multiply: [
                  { $divide: ['$totalCost', '$totalImpressions'] },
                  1000,
                ],
              },
              0,
            ],
          },
        },
      },
    ]);

    const cpm = result ? result.cpm : 0;
    console.log('cpm');
    console.log(cpm);
    return cpm;
  };

  predictImpressions = async (bannerSize, category, budget) => {
    try {
      const cpm = await this.calculateCPM(bannerSize, category);

      if (cpm === 0) {
        throw new Error('CPM equals zero');
      }

      const predictedImpressions = (budget / cpm) * 1000;
      return { predictedImpressions, cpm };
    } catch (error) {
      console.error('Error predicting impressions:', error);
    }
  };

  calculateCTR = async (bannerSize, category) => {
    try {
      const [result] = await Impression.aggregate([
        {
          $match: { banner_size: bannerSize, category: category },
        },
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
            totalImpressions: { $count: {} },
            totalClicks: { $sum: { $size: '$clicks' } },
          },
        },
        {
          $project: {
            _id: 0,
            ctr: {
              $cond: [
                { $ne: ['$totalImpressions', 0] },
                { $divide: ['$totalClicks', '$totalImpressions'] },
                0,
              ],
            },
          },
        },
      ]);

      const ctr = result ? result.ctr : 0;
      return ctr;
    } catch (error) {
      console.error('Error calculating CTR:', error);
    }
  };

  predictClicks = async (
    bannerSize,
    category,
    predictedImpressions
  ) => {
    try {
      const ctr = await this.calculateCTR(bannerSize, category);

      if (ctr === 0) {
        throw new Error('CTR equals zero');
      }
      console.log('ctr');
      console.log(ctr);
      console.log('predictedImpressions');
      console.log(predictedImpressions);
      const predictedClicks = predictedImpressions * ctr;
      console.log('predictedClicks');
      console.log(predictedClicks);

      return { predictedClicks, ctr };
    } catch (error) {
      console.error('Error predicting clicks:', error);
    }
  };

  calculateUniqueUsersFromImpressions = async (
    bannerSize,
    category
  ) => {
    try {
      const [result] = await Impression.aggregate([
        {
          $match: { banner_size: bannerSize, category: category },
        },
        {
          $group: {
            _id: '$user_id', // Группируем по user_id для получения уникальных пользователей
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: null,
            totalUniqueUsers: { $sum: 1 },
            totalImpressions: { $sum: '$count' },
          },
        },
        {
          $project: {
            _id: 0,
            avgUniqueUsersPerImpression: {
              $cond: [
                { $ne: ['$totalImpressions', 0] },
                {
                  $divide: ['$totalUniqueUsers', '$totalImpressions'],
                },
                0,
              ],
            },
          },
        },
      ]);
      console.log('ddddddddd');
      console.log(result);

      return result ? result.avgUniqueUsersPerImpression : 0;
    } catch (error) {
      console.error(
        'Error calculating average unique users from impressions:',
        error
      );
    }
  };

  predictUniqueUsersFromImpressions = async (
    bannerSize,
    category,
    predictedImpressions
  ) => {
    try {
      const avgUniqueUsersPerImpression =
        await this.calculateUniqueUsersFromImpressions(
          bannerSize,
          category
        );

      if (avgUniqueUsersPerImpression === 0) {
        throw new Error(
          'The average number of unique users is zero, calculation is not possible.'
        );
      }

      console.log(avgUniqueUsersPerImpression);
      const predictedUniqueUsers =
        avgUniqueUsersPerImpression * predictedImpressions;

      return predictedUniqueUsers;
    } catch (error) {
      console.error(
        'Error predicting unique users from impressions:',
        error
      );
    }
  };
  calculateRecommendedBid = (budget, clicks, ctr) => {
    const cpc = budget / clicks;
    console.log('cpc');
    console.log(cpc);

    const recommendedBid = ctr > 0 ? Math.min(cpc / ctr, 10) : 0.1; // Пример, можно настроить порог

    return recommendedBid;
  };
}

module.exports = new StatisticsService();
