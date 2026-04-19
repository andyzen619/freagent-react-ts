INSERT INTO player_stats (
    player_key, 
    stat_category, 
    coverage_type, 
    stat_id,
    timeframe_key, 
    stats
) 
SELECT 
    (data->>'player_key')::text,
    (data->>'stat_category')::text,
    (data->>'coverage_type')::text,
    (data->>'stat_id')::text,
    (data->>'timeframe_key')::text,
    (data->'stats')::jsonb
FROM jsonb_array_elements($1::jsonb) AS data
ON CONFLICT (player_key, stat_category, coverage_type, timeframe_key, stat_id)
DO UPDATE SET 
    stats = EXCLUDED.stats,
    updated_at = CURRENT_TIMESTAMP;
