import { Client } from "pg";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import { player } from "../player/index.js";
import type { PlayerClass } from "../../lib/yahoo/types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const dataSynchronization = {
  start: async ({
    pgClient,
    players,
  }: {
    pgClient: Client;
    players: PlayerClass[];
  }) => {
    const sql = await fs.readFile(
      join(__dirname, "./sql/playersTableCreate.sql"),
      "utf8",
    );

    await pgClient.query(sql);

    await player.insertIntoDb({ pgClient, players });
  },
};
