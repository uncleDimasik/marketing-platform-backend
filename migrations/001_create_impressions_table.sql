CREATE TABLE IF NOT EXISTS impressions (
    timestamp DateTime,
    impression_id UInt32,
    banner_size String,
    category String,
    user_id String,
    bid Float32
) ENGINE = MergeTree()
ORDER BY (impression_id, timestamp);

