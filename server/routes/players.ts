import { Router } from "express";
import { AuthorizationToken, Logging } from "../lib/utils.js";
import { YahooApi } from "../lib/yahoo/index.js";
import { dataSynchronization } from "../business/dataSynchronization/index.js";
import { db } from "../database/database.js";

const router = Router();
const { pgClient } = db.initialize();

router.get("/", async (req, res) => {
  try {
    const { token } = AuthorizationToken.fromRequestHeaders(req);

    const query = `
      SELECT 
        player_key,
        player_id,
        name_full,
        name_first,
        name_last,
        status,
        primary_position,
        eliagible_positions,
        created_at,
        updated_at
      FROM players
      ORDER BY name_full ASC
    `;

    const result = await pgClient.query(query);

    return res.status(200).send({ players: result.rows, total: result.rows.length });
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
