import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ConfigApiSever, ConfigYahoo } from "@/config";
import { useAuthState } from "@/hooks/useAuthState";

import type { Dispatch, SetStateAction } from "react";
import type { AuthState } from "../hooks/useAuthState";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { authState, setAuthState } = useAuthState();

  useEffect(() => {
    checkExistingToken({ setAuthState });
  }, [setAuthState]);

  return (
    <div className="flex">
      {authState.reloadAuth ? (
        <button onClick={() => initiateRequestToken()}>Reload Auth</button>
      ) : (
        <button
          className="border"
          onClick={async () => {
            const { data } = await syncToServerDatabase({ authState });

            console.log("Data synced to server database", data);
          }}
        >
          Synchronize
        </button>
      )}
    </div>
  );
}

/**
 * Redirects the current browser to Yahoo’s request‑token endpoint.
 *
 * The function is synchronous – it just builds the URL and assigns it to
 * `location.href`.  It defaults the `Window` parameter to the global `window`
 * so callers don’t have to pass anything, and it uses the URL/URLSearchParams
 * APIs for clarity.  The `async` was removed since there’s nothing to await.
 *
 * @param win – optional window object (useful for testing); defaults to the
 *              global `window` when available.
 */
async function initiateRequestToken(
  win: Window = typeof window !== "undefined" ? window : ({} as Window),
) {
  const params = new URLSearchParams({
    client_id: ConfigYahoo.CLIENT_ID,
    redirect_uri: ConfigYahoo.REDIRECT_URL,
    response_type: "code",
    language: "en-us",
  });

  const url = new URL(ConfigYahoo.REQUEST_TOKEN_URL);
  url.search = params.toString();

  win.location.href = url.toString();
}

function checkExistingToken({
  setAuthState,
}: {
  setAuthState: Dispatch<SetStateAction<AuthState>>;
}) {
  const existingToken = sessionStorage.getItem("access_token");

  if (existingToken) {
    setAuthState((prev) => ({
      ...prev,
      accessToken: { accessToken: existingToken, text: "Authorized!" },
    }));

    return;
  } else {
    setAuthState((prev) => ({
      ...prev,
      reloadAuth: true,
    }));
  }
}

async function syncToServerDatabase({ authState }: { authState: AuthState }) {
  const response = await fetch(`${ConfigApiSever.URL}/players/sync`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authState.accessToken.accessToken}`,
    },
  });

  if (!response.ok) {
    return { data: null };
  }

  const data = await response.json();

  return { data };
}
