
CREATE TABLE IF NOT EXISTS players (
    player_key VARCHAR(255) PRIMARY KEY,
    player_id VARCHAR(255),
    name_full VARCHAR(255),
    name_first VARCHAR(255),
    name_last VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_players_player_id ON players(player_id);
