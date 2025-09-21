import express from "express";
import cors from "cors";

const ACCESS_TOKEN_URL = "https://api.login.yahoo.com/oauth2/get_token";

const CLIENT_SECRET = "add36b85715f4023f932adf55de4af46d1fd9716";

const app = express();

const port = 3000;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "https://2e2e1b4c5577.ngrok-free.app", // Or the specific domain of your frontend
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
