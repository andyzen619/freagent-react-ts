import { Client } from "pg";
import { player } from "../player/index.js";
import type { PlayerClass } from "../../lib/yahoo/types.js";

export const dataSynchronization = {
  start: async ({
    pgClient,
    players,
  }: {
    pgClient: Client;
    players: PlayerClass[];
  }) => {
    await player.insertIntoDb({ pgClient, players });
  },
};
