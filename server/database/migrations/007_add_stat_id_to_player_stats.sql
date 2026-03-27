ALTER TABLE player_stats ADD COLUMN IF NOT EXISTS stat_id VARCHAR(50);

ALTER TABLE player_stats DROP CONSTRAINT IF EXISTS unique_player_stat_entry;

ALTER TABLE player_stats ADD CONSTRAINT unique_player_stat_entry UNIQUE NULLS NOT DISTINCT (player_key, stat_category, coverage_type, season, date, stat_id);
