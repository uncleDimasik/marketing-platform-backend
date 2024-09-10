require('dotenv').config();
const clickhouseClient = require('./../storage/clickhouse');
const {formatDateToClickhouse} = require("./formatDateToClickhouse");


const CHUNK_SIZE = 100_000;
const USERS_NUMBER = 20_000;


const client = clickhouseClient.clickhouseClient;


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
    `user${Math.floor(Math.random() * USERS_NUMBER)}`;

const getRandomBid = () =>
    (Math.random() * (10 - 0.1) + 0.1).toFixed(1);

const generateRandomTimestampWithinLastYear = () => {
    const now = Date.now();
    const oneYearAgo = now - 365 * 24 * 60 * 60 * 1000; // Calculate the timestamp for exactly one year ago

    return formatDateToClickhouse(new Date(
        oneYearAgo + Math.floor(Math.random() * (now - oneYearAgo))
    ).toISOString()); // ISO формат для ClickHouse
};

let idCounter = 1;
const generateUniqueId = () => idCounter++;


const generateRandomImpressions = (numImpressions) => {
    const impressions = [];
    for (let i = 0; i < numImpressions; i++) {
        impressions.push({
            timestamp: generateRandomTimestampWithinLastYear(),
            impression_id: generateUniqueId(),
            banner_size: getRandomBannerSize(),
            category: getRandomCategory(),
            user_id: getRandomUserId(),
            bid: parseFloat(getRandomBid()),
        });
    }
    return impressions;
};

const seedImpressions = async (numImpressions = 10) => {
    try {
        console.log('Connected to ClickHouse');

        // Очистка таблицы (если необходимо)
        await client.query({
            query: 'TRUNCATE TABLE impressions',
            format: 'JSONEachRow',
        });
        console.log('Existing Impression data removed');

        const chunks = Math.ceil(numImpressions / CHUNK_SIZE);
        for (let i = 0; i < chunks; i++) {
            const chunkSize = i === chunks ? numImpressions % CHUNK_SIZE : CHUNK_SIZE;
            const impressions = generateRandomImpressions(chunkSize);

            // Вставка данных в таблицу ClickHouse
            await client.insert({
                table: 'impressions',
                values: impressions,
                format: 'JSONEachRow', // Используем формат JSONEachRow для вставки данных
                columns: ['timestamp', 'impression_id', 'banner_size', 'category', 'user_id', 'bid'],
            });

            console.log(`Inserted chunk ${i + 1} of ${chunks} (Size: ${chunkSize})`);
        }
        console.log(
            `Impression data inserted successfully. Total records: ${numImpressions}`
        );
    } catch (error) {
        console.error('Error seeding Impression data:', error);
    } finally {
        await client.close();
    }
};

// Запуск функции с количеством записей
seedImpressions(2_000_000);
