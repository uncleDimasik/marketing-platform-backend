const fs = require('fs');
const path = require('path')
const clickhouseClient =require('./../storage/clickhouse');


const client = clickhouseClient.clickhouseClient;

// Функция для выполнения миграции
const runMigration = async (file) => {
    const sql = fs.readFileSync(file, 'utf8');
    console.log(sql);
    await client.query({
        query: `${sql}`,
        format: 'JSONEachRow',
    })
    console.log(`Migration ${path.basename(file)} applied successfully.`);
};

const runMigrations = async () => {
    const migrationsDir = path.join(__dirname, '../migrations');
    const migrationFiles = fs.readdirSync(migrationsDir);
    for (const file of migrationFiles) {
        await runMigration(path.join(migrationsDir, file));
    }
};

runMigrations().then(() => {
    console.log('All migrations applied successfully.');
    client.close();
}).catch((error) => {
    console.error('Error applying migrations:', error);
    client.close();
});
