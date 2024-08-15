require('dotenv').config();
const mongoose = require('mongoose');
const Impression = require('../models/impression-model');

const getRandomBannerSize = () => {
  const sizes = ['300x250', '728x90', '160x600', '468x60'];
  return sizes[Math.floor(Math.random() * sizes.length)];
};

const getRandomCategory = () => {
  const categories = [
    'Technology',
    'Health',
    'Finance',
    'Education',
    'Entertainment',
  ];
  return categories[Math.floor(Math.random() * categories.length)];
};

const getRandomUserId = () =>
  `user${Math.floor(Math.random() * 1000)}`;

const getRandomBid = () =>
  (Math.random() * (10 - 0.1) + 0.1).toFixed(1);

const generateRandomImpressions = (numImpressions) => {
  const impressions = [];
  for (let i = 0; i < numImpressions; i++) {
    impressions.push({
      timestamp: new Date(
        Date.now() - Math.floor(Math.random() * 10000000000)
      ), // случайная дата в прошлом
      banner_size: getRandomBannerSize(),
      category: getRandomCategory(),
      user_id: getRandomUserId(),
      bid: parseFloat(getRandomBid()), // Преобразование строки в число с плавающей точкой
    });
  }
  return impressions;
};

const seedImpressions = async (numImpressions = 10) => {
  // По умолчанию создается 10 записей
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to the database');

    await Impression.deleteMany({});
    console.log('Existing Impression data removed');

    const impressions = generateRandomImpressions(numImpressions);

    await Impression.insertMany(impressions);
    console.log(
      `Impression data inserted successfully. Total records: ${numImpressions}`
    );
  } catch (error) {
    console.error('Error seeding Impression data:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedImpressions(200);
