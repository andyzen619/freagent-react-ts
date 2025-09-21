import { useState, useEffect } from "react";

import "./App.css";

const CLIENT_ID =
  "dj0yJmk9NWFQVWJadWZ4a3dNJmQ9WVdrOWRYTlFUbk5FWmswbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWVl";

const CLIENT_SECRET = "add36b85715f4023f932adf55de4af46d1fd9716";

const REQUEST_TOKEN_URL = "https://api.login.yahoo.com/oauth2/request_auth";

const REDIRECT_URL = "https://2e2e1b4c5577.ngrok-free.app/oauth_callback";

const ACCESS_TOKEN_URL = "https://api.login.yahoo.com/oauth2/get_token";

function App() {
  const [authState, setAuthState] = useState<any>({
    accessToken: "",
    requestToken: "",
  });

  useEffect(() => {
    const getRequestToken = async () => {
      const params = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URL,
        response_type: "code",
        language: "en-us",
      });

      const url = REQUEST_TOKEN_URL + "?" + params.toString();

      window.location.href = url;
    };

    const getAccessToken = async ({
      requestToken,
    }: {
      requestToken: string;
    }) => {
      const body = new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URL,
        code: requestToken ?? "",
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

      const tokenResponse = await response.json();

      const { access_token: accessToken } = tokenResponse;

      setAuthState({ ...authState, accessToken });
    };

    console.log("Current URL:", window.location.href);

    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get("code") === null) {
      getRequestToken();
    }

    const requestToken = urlParams.get("code");

    if (requestToken) {
      setAuthState({ ...authState, requestToken });

      getAccessToken({ requestToken });
    }
  }, []);

  return <div>REQUEST_TOKEN: {authState.requestToken}</div>;
}

export default App;
