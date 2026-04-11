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
    const { token } = AuthorizationToken.fromRequestHeaders(req);

    const { players } = await player.getAll({ pgClient });

    return res.status(200).send({ players });
  } catch (error) {
    Logging.logError(error);

    if (error instanceof Error) {
      if (error.message.includes("401")) {
        return res.status(401).send("Unable to authenticate.");
      }
    }

    return res.status(500).send({ error: "Failed to fetch players" });
  }
});

router.post("/sync", async (req, res) => {
  try {
    const { token } = AuthorizationToken.fromRequestHeaders(req);

    const { count, players } = await YahooApi.getAll({ token });

    const { players: playersWithStats } = await YahooApi.getStats({
      token,
    });

    await dataSynchronization.start({ pgClient, players, playersWithStats });

    return res.status(200).send({ playersTotal: count });
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
