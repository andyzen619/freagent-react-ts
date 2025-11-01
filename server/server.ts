import express from "express";
import cors from "cors";
import { AuthorizationToken } from "./common/index.js";
import { Player } from "./core/Player.js";

const ACCESS_TOKEN_URL = "https://api.login.yahoo.com/oauth2/get_token";

const CLIENT_SECRET = "add36b85715f4023f932adf55de4af46d1fd9716";

const app = express();

const port = 3000;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

app.use((req, res, next) => {
  const now = new Date().toISOString();

  console.log(`\n---------------- ${now} - ${req.method} ${req.originalUrl}\n`);

  if (req.body && Object.keys(req.body).length > 0) {
    console.log("Request Body:", JSON.stringify(req.body, null, 2));
  }

  next();
});

app.use(
  cors({
    origin: `https://65990ff7092b.ngrok-free.app`, // Or the specific domain of your frontend
  }),
);

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
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`Token request failed: ${response.statusText}`);
  }

  const { access_token } = await response.json();

  res.status(200).send({ access_token });
});

app.get("/players", async (req, res) => {
  try {
    console.log("asdfasdf");

    console.log("asdfasdf");

    console.log("asdfasdf");

    const { token } = AuthorizationToken.fromRequestHeaders(req);

    const { players } = await Player.YahooApi.getAll({ token });

    return res.status(200).send({ players });
  } catch (error) {
    console.error(error);

    return res.status(500).send({ error: "Failed to fetch players" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
