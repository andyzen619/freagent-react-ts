import { useState, useEffect } from "react";

import "./App.css";

import { Button } from "@/components/ui/button";

const CLIENT_ID =
  "dj0yJmk9NWFQVWJadWZ4a3dNJmQ9WVdrOWRYTlFUbk5FWmswbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWVl";

const CLIENT_SECRET = "add36b85715f4023f932adf55de4af46d1fd9716";

function App() {
  const [authState, setAuthState] = useState<any>({
    oauthToken: "",
    oauthTokenSecret: "",
    requestToken: "",
  });

  useEffect(() => {
    console.log("Current URL:", window.location.href);

    const urlParams = new URLSearchParams(window.location.search);

    const getRequestToken = async () => {
      const params = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: "https://2e2e1b4c5577.ngrok-free.app/oauth_callback",
        response_type: "code",
        language: "en-us",
      });

      const url =
        "https://api.login.yahoo.com/oauth2/request_auth?" + params.toString();

      window.location.href = url;
    };

    if (urlParams.get("code") === null) {
      getRequestToken();
    }

    const requestToken = urlParams.get("code");

    setAuthState({ ...authState, requestToken });
  }, []);

  return <div>REQUEST_TOKEN: {authState.requestToken}</div>;
}

export default App;
