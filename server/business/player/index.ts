import { Client } from "pg";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import type { PlayerClass } from "../../lib/yahoo/types.js";
import { db } from "../../database/database.js";
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
  }: {
    pgClient: Client;
  }): Promise<{ players: Player[] }> => {
    const sql = await fs.readFile(
      join(__dirname, "./sql/getAllPlayersWithStats.sql"),
      "utf8",
    );

    const { rows } = await pgClient.query(sql);

    const players = rows.map((row: PlayerModel & PlayerStatModel) => {
      return {
        name: row.name_full,
        playerStatKey: row.player_key,
        // !need to aggregate because each stat is a row and a player has multiple stats.
      };
    });

    return { players };
  },
  insertIntoDb: async ({
    pgClient,
    players,
  }: {
    pgClient: Client;
    players: PlayerClass[];
  }) => {
    const sql = await fs.readFile(
      join(__dirname, "./sql/playersInsertIntoPlayersTable.sql"),
      "utf8",
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
