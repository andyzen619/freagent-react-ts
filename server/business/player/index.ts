import { Client } from "pg";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import type { PlayerClass } from "../../lib/yahoo/types.js";
import { db } from "../../database/database.js";
import { databseUtils } from "../../database/utils.js";
import { statMapper } from "../../lib/yahoo/statMapper.js";
import type { PlayerModel } from "../../database/models/PlayerModel.js";
import type { PlayerStatModel } from "../../database/models/PlayerStatModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface Player {
  name: string;
  playerStatKey: string;
}

export const player = {
  getAllWithStats: async ({
    pgClient,
    coverageType = "season",
  }: {
    pgClient: Client;
    coverageType?: string;
  }): Promise<{ players: Player[] }> => {
    const sql = await databseUtils.loadSqlFile(
      join(__dirname, "./sql/getAllPlayersWithStats.sql"),
    );

    const { rows } = await pgClient.query(
      `${sql} WHERE player_stats.coverage_type = $1`,
      [coverageType],
    );

    const playersMap = new Map<string, Player & { [key: string]: any }>();

    for (const row of rows) {
      if (!playersMap.has(row.player_key)) {
        playersMap.set(row.player_key, {
          name: row.name_full,
          playerStatKey: row.player_key,
        });
      }

      const player = playersMap.get(row.player_key)!;
      if (row.stat_id !== null && row.stat_value !== undefined) {
        const displayName = await statMapper.getDisplayName(row.stat_id);
        player[displayName] = row.stat_value;
      }
    }

    return { players: Array.from(playersMap.values()) };
  },
  insertIntoDb: async ({
    pgClient,
    players,
  }: {
    pgClient: Client;
    players: PlayerClass[];
  }) => {
    const sql = await databseUtils.loadSqlFile(
      join(__dirname, "./sql/playersInsertIntoPlayersTable.sql"),
    );

    const values = players.map((player: PlayerClass) => {
      const {
        player_id,
        player_key,
        name,
        eligible_positions,
        primary_position,
        status,
      } = player;

      const toInsert = {
        player_id,
        player_key,
        name_first: name?.first,
        name_last: name?.last,
        name_full: name?.full,
        eligible_positions: eligible_positions?.map((p) => p.position),
        primary_position,
        status,
      };

      return toInsert;
    });

    const jsonValues = JSON.stringify(values);

    try {
      await pgClient.query(sql, [jsonValues]);
    } catch (error) {
      throw new db.Errors.DatabaseError({
        error,
        sql,
      });
    }
  },
};
