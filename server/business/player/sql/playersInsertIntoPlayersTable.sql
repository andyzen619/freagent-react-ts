INSERT INTO players (
    player_key, 
    player_id, 
    name_full, 
    name_first, 
    name_last
) 
SELECT 
    (data->>'player_key')::text,
    (data->>'player_id')::text,
    (data->>'name_full')::text,
    (data->>'name_first')::text,
    (data->>'name_last')::text
FROM jsonb_array_elements($1::jsonb) AS data
ON CONFLICT (player_key) 
DO UPDATE SET 
    player_id = EXCLUDED.player_id,
    name_full = EXCLUDED.name_full,
    name_first = EXCLUDED.name_first,
    name_last = EXCLUDED.name_last;
