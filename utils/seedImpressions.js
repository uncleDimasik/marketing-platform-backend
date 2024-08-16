require('dotenv').config();
const mongoose = require('mongoose');
const Impression = require('../models/impression-model');

const CHUNK_SIZE = 1000; // Define the size of each chunk

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

const generateRandomTimestampWithinLastYear = () => {
  const now = Date.now();
  const oneYearAgo = now - 365 * 24 * 60 * 60 * 1000; // Calculate the timestamp for exactly one year ago

  return new Date(
      oneYearAgo + Math.floor(Math.random() * (now - oneYearAgo))
  );
};

const generateRandomImpressions = (numImpressions) => {
  const impressions = [];
  for (let i = 0; i < numImpressions; i++) {
    impressions.push({
      timestamp: generateRandomTimestampWithinLastYear(),
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


    const chunks = Math.ceil(numImpressions / CHUNK_SIZE);
    for (let i = 0; i < chunks; i++) {
      const chunkSize = i === chunks  ? numImpressions % CHUNK_SIZE : CHUNK_SIZE;
      const impressions = generateRandomImpressions(chunkSize);

      await Impression.insertMany(impressions);
      console.log(`Inserted chunk ${i + 1} of ${chunks} (Size: ${chunkSize})`);
    }
    console.log(
      `Impression data inserted successfully. Total records: ${numImpressions}`
    );
  } catch (error) {
    console.error('Error seeding Impression data:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedImpressions(20000);
