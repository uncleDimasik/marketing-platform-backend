require('dotenv').config();
const CHUNK_SIZE = 100_000; // Define the size of each chunk

const clickhouseClient = require('./../storage/clickhouse');
const {formatDateToClickhouse} = require("./formatDateToClickhouse");


const client = clickhouseClient.clickhouseClient;

const generateRandomTimestampWithinLastYear = () => {
    const now = Date.now();
    const oneYearAgo = now - 365 * 24 * 60 * 60 * 1000; // Calculate the timestamp for exactly one year ago

    return formatDateToClickhouse(new Date(
        oneYearAgo + Math.floor(Math.random() * (now - oneYearAgo))
    ).toISOString()); // ClickHouse обычно работает с ISO строками для дат
};

const fetchRandomImpressions = async (numImpressions) => {
    const query = `
    SELECT impression_id, user_id
    FROM impressions
    ORDER BY rand()
    LIMIT ${numImpressions}
  `;

    const result = await client.query({
        query,
        format: 'JSONEachRow',
    });

    return result.json(); // Возвращаем результат в формате JSON
};
let idCounter = 1;
const generateUniqueId = () => idCounter++;

const generateRandomClicks = (impressions, numClicks) => {
    const clicks = [];
    for (let i = 0; i < numClicks; i++) {
        const randomImpression =
            impressions[Math.floor(Math.random() * impressions.length)];
        clicks.push({
            timestamp: generateRandomTimestampWithinLastYear(),
            click_id: generateUniqueId(),
            impression_id: randomImpression.impression_id, // связываем с реальным Impression ID
            user_id: randomImpression.user_id, // совпадает с user_id из Impression
        });
    }
    return clicks;
};

const seedClicks = async (numClicks = 10) => {
    try {
        console.log('Connected to ClickHouse');

        // Очистка таблицы (если нужно)
        await client.query({
            query: 'TRUNCATE TABLE clicks',
            format: 'JSONEachRow',
        });
        console.log('Existing Click data removed');

        const chunks = Math.ceil(numClicks / CHUNK_SIZE);
        for (let i = 0; i < chunks; i++) {
            const chunkSize = i === chunks ? numClicks % CHUNK_SIZE : CHUNK_SIZE;

            // Fetch random impressions for this chunk
            const impressions = await fetchRandomImpressions(chunkSize);

            if (impressions.length === 0) {
                console.log('No impressions found. Please seed impressions first.');
                return;
            }

            const clicks = generateRandomClicks(impressions, chunkSize);

            // Вставка данных в ClickHouse
            await client.insert({
                table: 'clicks',
                values: clicks,
                format: 'JSONEachRow',
                columns: ['timestamp', 'click_id', 'impression_id', 'user_id'],
            });

            console.log(`Inserted chunk ${i + 1} of ${chunks} (Size: ${chunkSize})`);
        }

        console.log(`Click data inserted successfully. Total records: ${numClicks}`);
    } catch (error) {
        console.error('Error seeding Click data:', error);
    } finally {
        await client.close();
    }
};

// Запуск функции с указанным количеством записей
seedClicks(600_000);
