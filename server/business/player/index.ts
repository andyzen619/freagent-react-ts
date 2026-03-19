import { Client } from "pg";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import type { PlayerClass } from "../../lib/yahoo/types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const player = {
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

    const values = players.map((player) => {
      const { player_id, player_key, name } = player;

      return {
        player_id,
        player_key,
        name_first: name?.first,
        name_last: name?.last,
        name_full: name?.full,
      };
    });

    const jsonValues = JSON.stringify(values);

    await pgClient.query(sql, [jsonValues]);
  },
};
