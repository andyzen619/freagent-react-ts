import { useState, useEffect } from "react";

import "./App.css";

const CLIENT_ID =
  "dj0yJmk9NWFQVWJadWZ4a3dNJmQ9WVdrOWRYTlFUbk5FWmswbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWVl";

const REQUEST_TOKEN_URL = "https://api.login.yahoo.com/oauth2/request_auth";

const REDIRECT_URL = "https://92f019e0be91.ngrok-free.app/oauth_callback";

const ACCESS_TOKEN_URL = "http://localhost:3000/get_token";

function App() {
  const [authState, setAuthState] = useState<any>({
    accessToken: "",
    requestToken: "",
    reloadAuth: false,
  });

  useEffect(() => {
    const initiateRequestToken = async () => {
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
        redirect_uri: REDIRECT_URL,
        code: requestToken ?? "",
      });

      const response = await fetch(ACCESS_TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      });

      if (!response.ok) {
        setAuthState({ ...authState, reloadAuth: true });

        throw new Error(`Token request failed: ${response.statusText}`);
      }

      const { access_token: accessToken } = await response.json();

      setAuthState({
        ...authState,
        accessToken: { accessToken, text: "Authorized!" },
      });

      sessionStorage.setItem("access_token", accessToken);
    };

    const getRequestTokenFromUrl = () => {
      const urlParams = new URLSearchParams(window.location.search);

      if (urlParams.get("code") === null) {
        initiateRequestToken();
      }

      const requestToken = urlParams.get("code");

      return { requestToken };
    };

    const existingToken = sessionStorage.getItem("access_token");

    if (existingToken) {
      setAuthState((prev: any) => ({
        ...prev,
        accessToken: { accessToken: existingToken, text: "Authorized!" },
      }));

      return;
    }

    const { requestToken } = getRequestTokenFromUrl();

    if (requestToken) {
      setAuthState({
        ...authState,
        requestToken: { requestToken, text: "Requesting access...." },
      });

      getAccessToken({ requestToken });
    }
  }, []);

  return (
    <div>
      AUTH STATUS: {authState.requestToken?.text ?? authState.accessToken?.text}
      {authState.reloadAuth && (
        <button onClick={() => (window.location.href = "/")}>
          Reload Auth
        </button>
      )}
    </div>
  );
}

export default App;
