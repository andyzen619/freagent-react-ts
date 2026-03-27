ALTER TABLE player_stats
ADD CONSTRAINT unique_player_stat_entry UNIQUE NULLS NOT DISTINCT (player_key, stat_category, coverage_type, season, date);
