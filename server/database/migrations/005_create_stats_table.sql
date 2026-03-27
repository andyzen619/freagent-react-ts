CREATE TABLE IF NOT EXISTS player_stats (
    id SERIAL PRIMARY KEY,
    player_key VARCHAR(255) NOT NULL REFERENCES players(player_key) ON DELETE CASCADE,
    stat_category VARCHAR(50) NOT NULL,
    coverage_type VARCHAR(50),
    season VARCHAR(20),
    date VARCHAR(50),
    stats JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_player_stats_player_key ON player_stats(player_key);
CREATE INDEX IF NOT EXISTS idx_player_stats_season ON player_stats(season);
