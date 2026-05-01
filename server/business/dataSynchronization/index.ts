import { Client } from "pg";
import { player } from "../player/index.js";
import { playerStats } from "../playerStats/index.js";
import type { PlayerClass } from "../../lib/yahoo/types.js";

export const dataSynchronization = {
  start: async ({
    pgClient,
    players,
  }: {
    pgClient: Client;
    players: PlayerClass[];
  }) => {
    // 1. Insert/Update basic player info
    await player.insertIntoDb({ pgClient, players });

    // 2. Upsert player stats
    await playerStats.upsert({
      pgClient,
      players: players,
      coverage_type: "season",
    });
  },
};
