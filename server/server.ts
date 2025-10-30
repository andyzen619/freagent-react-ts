import express from "express";
import cors from "cors";
import { XMLParser } from "fast-xml-parser";

const ACCESS_TOKEN_URL = "https://api.login.yahoo.com/oauth2/get_token";

const CLIENT_SECRET = "add36b85715f4023f932adf55de4af46d1fd9716";

const app = express();

const port = 3000;

const xmlParser = new XMLParser();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: " https://65990ff7092b.ngrok-free.app", // Or the specific domain of your frontend
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
  const { authorization } = req.headers;

  if (!authorization) {
    throw new Error("Authentication Error");
  }

  const [, token] = authorization.split(" ");

  const response = await fetch(
    "https://fantasysports.yahooapis.com/fantasy/v2/league/nba.l.40314/players",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    console.error(`Yahoo Error: ${response.statusText}`);

    return res
      .status(response.status)
      .send({ error: "Failed to fetch players" });
  }

  const xmlData = await response.text();

  const parsedXmlData = xmlParser.parse(xmlData);

  const yahooError = parsedXmlData["yahoo:error"];

  if (yahooError) {
    const yahooErrorDescription = yahooError["yahoo:description"];

    console.error(`Yahoo Error: ${yahooErrorDescription}`);

    return res.status(502).send({ error: "Failed to fetch players" });
  }

  const { fantasy_content, error } = parsedXmlData;

  if (error) {
    console.error(`Yahoo Error: ${error}`);

    return res.status(502).send({ error: "Failed to fetch players" });
  }

  const data = fantasy_content;

  res.status(200).send(data);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
