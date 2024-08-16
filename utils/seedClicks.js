require('dotenv').config();
const mongoose = require('mongoose');
const Click = require('../models/click-model');
const Impression = require('../models/impression-model');

const CHUNK_SIZE = 1000; // Define the size of each chunk

const generateRandomTimestampWithinLastYear = () => {
  const now = Date.now();
  const oneYearAgo = now - 365 * 24 * 60 * 60 * 1000; // Calculate the timestamp for exactly one year ago

  return new Date(
      oneYearAgo + Math.floor(Math.random() * (now - oneYearAgo))
  );
};

const generateRandomClicks = (impressions, numClicks) => {
  const clicks = [];
  for (let i = 0; i < numClicks; i++) {
    const randomImpression =
      impressions[Math.floor(Math.random() * impressions.length)];
    clicks.push({
      timestamp:generateRandomTimestampWithinLastYear(),
      impression_id: randomImpression._id, // связываем с реальным Impression ID
      user_id: randomImpression.user_id, // совпадает с user_id из Impression
    });
  }
  return clicks;
};

const seedClicks = async (numClicks = 10) => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to the database');

    const impressions = await Impression.find(
      {},
      { _id: 1, user_id: 1 }
    ).lean();
    if (impressions.length === 0) {
      console.log(
        'No impressions found. Please seed impressions first.'
      );
      return;
    }

    await Click.deleteMany({});
    console.log('Existing Click data removed');

    const chunks = Math.ceil(numClicks / CHUNK_SIZE);
    for (let i = 0; i < chunks; i++) {
      const chunkSize = i === chunks  ? numClicks % CHUNK_SIZE : CHUNK_SIZE;
      const clicks = generateRandomClicks(impressions, chunkSize);

      await Click.insertMany(clicks);
      console.log(`Inserted chunk ${i + 1} of ${chunks} (Size: ${chunkSize})`);
    }

    console.log(`Click data inserted successfully. Total records: ${numClicks}`);
  } catch (error) {
    console.error('Error seeding Click data:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedClicks(6000);
