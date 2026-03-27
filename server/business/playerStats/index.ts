import { Client } from "pg";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import type { PlayerClass, PlayerStats } from "../../lib/yahoo/types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface PlayerWithStats {
  player_key?: string | undefined;
  player_stats?: PlayerStats | undefined;
  player_advanced_stats?: PlayerStats | undefined;
}

export const playerStats = {
  upsert: async ({
    pgClient,
    players,
  }: {
    pgClient: Client;
    players: PlayerWithStats[];
  }) => {
    const sql = await fs.readFile(
      join(__dirname, "./sql/upsertPlayerStats.sql"),
      "utf8",
    );

    const values = players.flatMap((player) => {
      const statsToInsert = [];

      if (player.player_stats) {
        const coverage = player.player_stats[0];
        statsToInsert.push({
          player_key: player.player_key,
          stat_category: "standard",
          coverage_type: coverage?.coverage_type,
          season: coverage?.season,
          date: coverage?.date,
          stats: player.player_stats.stats,
        });
      }

      if (player.player_advanced_stats) {
        const coverage = player.player_advanced_stats[0];
        statsToInsert.push({
          player_key: player.player_key,
          stat_category: "advanced",
          coverage_type: coverage?.coverage_type,
          season: coverage?.season,
          date: coverage?.date,
          stats: player.player_advanced_stats.stats,
        });
      }

      return statsToInsert;
    });

    if (values.length === 0) return;

    const jsonValues = JSON.stringify(values);

    await pgClient.query(sql, [jsonValues]);
  },
};
