import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ConfigYahoo } from "@/config";

export const Route = createFileRoute("/oauth_callback")({
  component: RouteComponent,
});

function RouteComponent() {
  const [authState, setAuthState] = useState<any>({
    accessToken: "",
    requestToken: "",
    reloadAuth: false,
  });

  useEffect(() => {
    const getRequestTokenFromUrl = () => {
      const urlParams = new URLSearchParams(window.location.search);

      const requestToken = urlParams.get("code");

      return { requestToken };
    };

    const getAccessToken = async ({
      requestToken,
    }: {
      requestToken: string;
    }) => {
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
      }).catch((error) => {
        console.error(error);

        return { ok: false };
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
