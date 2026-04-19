-- Consolidate season and date into timeframe_key
ALTER TABLE player_stats ADD COLUMN timeframe_key VARCHAR(50);

-- Migrate existing data
UPDATE player_stats SET timeframe_key = season WHERE coverage_type = 'season';
UPDATE player_stats SET timeframe_key = date::text WHERE coverage_type = 'date';
UPDATE player_stats SET timeframe_key = 'current' WHERE timeframe_key IS NULL;

-- Drop old columns and constraints
ALTER TABLE player_stats DROP CONSTRAINT IF EXISTS unique_player_stat_entry;
ALTER TABLE player_stats DROP COLUMN season;
ALTER TABLE player_stats DROP COLUMN date;

-- Add new unique constraint
ALTER TABLE player_stats ADD CONSTRAINT unique_player_stat_entry 
UNIQUE NULLS NOT DISTINCT (player_key, stat_category, coverage_type, timeframe_key, stat_id);
