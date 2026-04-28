import { Client } from "pg";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import type { PlayerStats, Stat } from "../../lib/yahoo/types.js";

import { db } from "../../database/database.js";
import { databseUtils } from "../../database/utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface PlayerWithStats {
  player_key?: string | undefined;
  player_stats?: PlayerStats | undefined;
  player_advanced_stats?: PlayerStats | undefined;
}

interface StatsRow {
  player_key?: string | undefined;
  stat_category: "standard" | "advanced";
  coverage_type?: string | undefined;
  timeframe_key?: string | undefined;
  stat_id?: string | undefined;
  stats: Stat;
}

export const playerStats = {
  upsert: async ({
    pgClient,
    players,
    coverage_type,
  }: {
    pgClient: Client;
    players: PlayerWithStats[];
    coverage_type: string;
  }) => {
    const sql = await databseUtils.loadSqlFile(
      join(__dirname, "./sql/upsertPlayerStats.sql"),
    );

    const values = players.flatMap((player) => {
      const statsToInsert: StatsRow[] = [];

      const processStats = (
        stats: PlayerStats | undefined,
        category: "standard" | "advanced",
      ) => {
        if (!stats) {
          return;
        }

        const timeframe_key =
          coverage_type === "date"
            ? stats[0]?.date
            : stats[0]?.season || "current";

        stats.stats.forEach(({ stat }) => {
          statsToInsert.push({
            player_key: player.player_key,
            stat_category: category,
            coverage_type,
            timeframe_key,
            stat_id: stat.stat_id,
            stats: stat,
          });
        });
      };

      processStats(player.player_stats, "standard");
      processStats(player.player_advanced_stats, "advanced");

      return statsToInsert;
    });

    if (values.length === 0) return;

    const jsonValues = JSON.stringify(values);

    try {
      await pgClient.query(sql, [jsonValues]);
    } catch (error) {
      throw new db.Errors.DatabaseError({
        sql,
        error,
      });
    }
  },
};
