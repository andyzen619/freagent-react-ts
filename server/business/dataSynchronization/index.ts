import { Client } from "pg";
import { player } from "../player/index.js";
import { playerStats, type PlayerWithStats } from "../playerStats/index.js";
import type { PlayerClass } from "../../lib/yahoo/types.js";

export const dataSynchronization = {
  start: async ({
    pgClient,
    players,
    playersWithStats,
    coverage_type,
  }: {
    pgClient: Client;
    players: PlayerClass[];
    playersWithStats: PlayerWithStats[];
    coverage_type: string;
  }) => {
    // 1. Insert/Update basic player info
    await player.insertIntoDb({ pgClient, players });

    // 2. Upsert player stats
    await playerStats.upsert({
      pgClient,
      players: playersWithStats,
      coverage_type,
    });
  },
};
