import { Router } from "express";
import { AuthorizationToken, Logging } from "../lib/utils.js";
import { YahooApi } from "../lib/yahoo/index.js";
import { dataSynchronization } from "../business/dataSynchronization/index.js";
import { db } from "../database/database.js";
import { playerStats } from "../business/playerStats/index.js";
import { player } from "../business/player/index.js";

const router = Router();
const { pgClient } = db.initialize();

router.get("/", async (req, res) => {
  try {
    const coverageType = (req.query.coverage_type as string) || "season";
    const { players } = await player.getAllWithStats({
      pgClient,
      coverageType,
    });

    return res.status(200).send({ players });
  } catch (error) {
    Logging.logError(error);

    if (error instanceof Error) {
      if (error.message.includes("401")) {
        return res.status(401).send({ error: "Unable to authenticate." });
      }
    }

    return res.status(500).send({ error: "Failed to fetch players" });
  }
});

router.post("/sync", async (req, res) => {
  try {
    const { token } = AuthorizationToken.fromRequestHeaders(req);
    const statsTypes = ["season", "average_season", "last7"]; // Changed lastweek to last7

    let allPlayers: any[] = [];
    let allPlayersWithStats: any[] = [];
    let currentIndex = 0;
    let totalCount = 0;

    console.log("Starting full synchronization...");

    // Fetch all players with pagination (max 6 pages)
    for (let i = 0; i < 6; i++) {
      console.log(`Fetching players batch starting at ${currentIndex}...`);
      const { count, players } = await YahooApi.getAll({
        token,
        start: currentIndex,
      });

      totalCount += count;
      allPlayers.push(...players);

      console.log(
        `Fetched ${players.length} players. Total accumulated: ${allPlayers.length}/${totalCount}`,
      );

      currentIndex += 25;
    }

    // Fetch stats for each type
    for (const statsType of statsTypes) {
      console.log(`Starting sync for stats type: ${statsType}...`);
      currentIndex = 0;
      for (let i = 0; i < 6; i++) {
        console.log(
          `Fetching player stats batch for ${statsType} starting at ${currentIndex}...`,
        );
        const { players: statsBatch } = await YahooApi.getStats({
          token,
          start: currentIndex,
          statsType,
        });

        await dataSynchronization.start({
          pgClient,
          players: allPlayers,
          playersWithStats: statsBatch,
          coverage_type: statsType,
        });

        console.log(
          `Fetched ${statsType} stats for ${statsBatch.length} players. Total accumulated: ${allPlayersWithStats.length}`,
        );

        currentIndex += 25;
      }
    }

    console.log(
      `Sync complete. Total Players: ${allPlayers.length}, Total Stats Entries: ${allPlayersWithStats.length}`,
    );

    return res.status(200).send({
      message: "Sync logs generated in console",
      playersTotal: allPlayers.length,
      statsTotal: allPlayersWithStats.length,
    });
  } catch (error) {
    Logging.logError(error);

    if (error instanceof Error) {
      if (error.message.includes("401")) {
        return res.status(401).send("Unable to authenticate.");
      }
    }

    return res.status(500).send({ error: "Failed to sync players" });
  }
});

export default router;
