import { createFileRoute } from "@tanstack/react-router";
import { ConfigYahoo } from "@/config";
import { useAuthState } from "@/hooks/useAuthState";
import { useEffect } from "react";

import type { Dispatch, SetStateAction } from "react";
import type { AuthState } from "../hooks/useAuthState";

export const Route = createFileRoute("/oauth_callback")({
  component: RouteComponent,
});

function RouteComponent() {
  const { authState, setAuthState } = useAuthState();

  useEffect(() => {
    const { requestToken } = getRequestTokenFromUrl();

    if (requestToken) {
      setAuthState((prev) => ({
        ...prev,
        requestToken: { requestToken, text: "Requesting access...." },
      }));

      getAccessToken({ requestToken, setAuthState });
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

function getRequestTokenFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);

  const requestToken = urlParams.get("code");

  return { requestToken };
}

async function getAccessToken({
  requestToken,
  setAuthState,
}: {
  requestToken: string;
  setAuthState: Dispatch<SetStateAction<AuthState>>;
}) {
  const body = new URLSearchParams({
    client_id: ConfigYahoo.CLIENT_ID,
    redirect_uri: ConfigYahoo.REDIRECT_URL,
    code: requestToken ?? "",
  });

  const response = await fetch(ConfigYahoo.ACCESS_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    setAuthState((prev) => ({ ...prev, reloadAuth: true }));
    throw new Error(`Token request failed: ${response.statusText}`);
  }

  const { access_token: accessToken } = await response.json();

  setAuthState((prev) => ({
    ...prev,
    accessToken: { accessToken, text: "Authorized!" },
  }));

  sessionStorage.setItem("access_token", accessToken);
}
