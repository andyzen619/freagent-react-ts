import { createFileRoute, Link } from "@tanstack/react-router";
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

    setAuthState((prev) => ({
      ...prev,
      requestToken: { requestToken, text: "Requesting access...." },
    }));

    const accessTokenInSessionStorage = sessionStorage.getItem("access_token");

    if (!accessTokenInSessionStorage) {
      getAccessToken({ requestToken, setAuthState }).then(({ accessToken }) => {
        setAuthState((prev) => ({
          ...prev,
          accessToken: { accessToken, text: "Authorized!" },
        }));

        sessionStorage.setItem("access_token", accessToken);
      });
    } else {
      setAuthState((prev) => ({
        ...prev,
        accessToken: {
          accessToken: accessTokenInSessionStorage,
          text: "Authorized!",
        },
      }));
    }
  }, [setAuthState]);

  return (
    <div className="flex gap-4">
      <div className="">
        {authState.accessToken?.text
          ? authState.accessToken?.text
          : authState.requestToken?.text}
      </div>

      <Link className="border" to="/">
        Home
      </Link>
    </div>
  );
}

function getRequestTokenFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);

  const requestToken = urlParams.get("code");

  if (!requestToken) {
    return { requestToken: "" };
  }

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

  return { accessToken };
}
