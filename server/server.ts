import express from "express";
import cors from "cors";

import { AuthorizationToken, Logging } from "./lib/utils.js";
import { YahooApi } from "./lib/yahoo/index.js";
import { requestLoggerMiddleware } from "./middleware/index.js";
import { db } from "./database.js";
import { dataSynchronization } from "../server/business/dataSynchronization/index.js";

const ACCESS_TOKEN_URL = "https://api.login.yahoo.com/oauth2/get_token";

const CLIENT_SECRET = "cd16154e9bc51acfd107e51957b4012723d764d3";

const { pgClient } = db.initialize();

const app = express();

const port = 3000;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

app.use(
  cors({
    origin: `*`, // Or the specific domain of your frontend
  }),
);

app.use(requestLoggerMiddleware);

app.get("/", (req, res) => {
  res.send("Hello from Freagent Server!");
});

app.post("/get_token", async (req, res) => {
  const { client_id, redirect_uri, code } = req.body;

  const body = new URLSearchParams({
    client_id,
    client_secret: CLIENT_SECRET,
    redirect_uri,
    code,
    grant_type: "authorization_code",
  });

  const response = await fetch(ACCESS_TOKEN_URL, {
    method: "POST",
    body,
  });

  if (!response.ok) {
    console.log({ response });

    throw new Error(`Token request failed: ${response.statusText}`);
  }

  const { access_token } = await response.json();

  res.status(200).send({ access_token });
});

app.post("/players/sync", async (req, res) => {
  try {
    const { token } = AuthorizationToken.fromRequestHeaders(req);

    const { count, players } = await YahooApi.getAll({ token });

    dataSynchronization.start({ pgClient, players });

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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
