import { Client, DatabaseError as PGError } from "pg";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import type { PlayerStats, Stat } from "../../lib/yahoo/types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface PlayerWithStats {
  player_key?: string | undefined;
  player_stats?: PlayerStats | undefined;
  player_advanced_stats?: PlayerStats | undefined;
}

class DatabaseError extends Error {
  public sql: string;
  public table: string | undefined;

  constructor(params: { message: string; sql: string; error: any }) {
    const pgError = params.error as PGError;

    super(params.message);
    this.sql = params.sql;
    this.table = pgError.table;
  }
}

interface StatsRow {
  player_key?: string | undefined;
  stat_category: "standard" | "advanced";
  coverage_type?: string | undefined;
  season?: string | undefined;
  date?: string | undefined;
  stat_id?: string | undefined;
  stats: Stat;
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
      const statsToInsert: StatsRow[] = [];

      if (player.player_stats) {
        const coverage = player.player_stats[0];
        player.player_stats.stats.forEach(({ stat }) => {
          statsToInsert.push({
            player_key: player.player_key,
            stat_category: "standard",
            coverage_type: coverage?.coverage_type,
            season: coverage?.season,
            date: coverage?.date,
            stat_id: stat.stat_id,
            stats: stat,
          });
        });
      }

      if (player.player_advanced_stats) {
        const coverage = player.player_advanced_stats[0];
        player.player_advanced_stats.stats.forEach(({ stat }) => {
          statsToInsert.push({
            player_key: player.player_key,
            stat_category: "advanced",
            coverage_type: coverage?.coverage_type,
            season: coverage?.season,
            date: coverage?.date,
            stat_id: stat.stat_id,
            stats: stat,
          });
        });
      }

      return statsToInsert;
    });

    if (values.length === 0) return;

    const jsonValues = JSON.stringify(values);

    try {
      await pgClient.query(sql, [jsonValues]);
    } catch (error) {
      throw new DatabaseError({
        message:
          error instanceof Error ? error.message : "Unknown database error",
        sql,
        error,
      });
    }
  },
};
