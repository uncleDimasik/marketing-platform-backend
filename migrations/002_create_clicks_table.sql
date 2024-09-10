CREATE TABLE IF NOT EXISTS clicks (
    timestamp DateTime,
     click_id UInt32,
    impression_id UInt32,
    user_id String
) ENGINE = MergeTree()
ORDER BY (click_id, timestamp);