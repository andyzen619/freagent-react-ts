import { Router } from "express";

const router = Router();

const ACCESS_TOKEN_URL = "https://api.login.yahoo.com/oauth2/get_token";
const CLIENT_SECRET = "cd16154e9bc51acfd107e51957b4012723d764d3";

router.post("/get_token", async (req, res) => {
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

export default router;
