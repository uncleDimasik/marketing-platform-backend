require('dotenv').config(); // Подгружаем переменные окружения из .env
const { createClient } = require('@clickhouse/client');

// Создаем клиент ClickHouse с нужными параметрами
const clickhouseClient = createClient({
    username: process.env.CLICKHOUSE_USER,
    password: process.env.CLICKHOUSE_PASSWORD,
    database: process.env.CLICKHOUSE_DB,
    url: process.env.CLICKHOUSE_URL,
    log: {
        enable: true, // Включаем логирование
    }
});

// Экспортируем созданный клиент
module.exports = {
    clickhouseClient
};
