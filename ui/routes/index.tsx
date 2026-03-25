import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ConfigApiSever, ConfigYahoo } from "@/config";
import { useAuthState } from "@/hooks/useAuthState";
import { Button } from "@/components/ui/button";
import { Loader2, Check } from "lucide-react";

import type { Dispatch, SetStateAction } from "react";
import type { AuthState } from "../hooks/useAuthState";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { authState, setAuthState } = useAuthState();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  useEffect(() => {
    checkExistingToken({ setAuthState });
  }, [setAuthState]);

  return (
    <div className="flex flex-col gap-8 p-4">
      <div className="grid grid-rows-2 grid-flow-col gap-4 overflow-x-auto pb-4 auto-cols-[minmax(150px,auto)]">
        {authState.reloadAuth ? (
          <Button variant="outline" onClick={() => initiateRequestToken()}>
            Reload Auth
          </Button>
        ) : (
          <Button
            variant="outline"
            disabled={isSyncing}
            onClick={async () => {
              setIsSyncing(true);
              setSyncSuccess(false);
              try {
                const { reloadauth, state } = await syncToServerDatabase({
                  authState,
                });

                if (reloadauth) {
                  setAuthState((prev) => ({ ...prev, reloadAuth: true }));
                } else {
                  console.log(state);
                  setSyncSuccess(true);
                  setTimeout(() => setSyncSuccess(false), 3000);
                }
              } catch (error) {
                console.error("Sync failed", error);
              } finally {
                setIsSyncing(false);
              }
            }}
          >
            {isSyncing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : syncSuccess ? (
              <>
                <Check className="mr-2 h-4 w-4 text-green-500" />
                Synced!
              </>
            ) : (
              "Synchronize"
            )}
          </Button>
        )}
        {Array.from({ length: 20 }).map((_, i) => (
          <Button
            key={i}
            variant="outline"
            onClick={() => console.log(`Template ${i + 1} clicked`)}
          >
            Template {i + 1}
          </Button>
        ))}
      </div>

      <div className="flex-1 border-2 border-dashed rounded-lg flex items-center justify-center min-h-[300px] text-muted-foreground">
        Other views content area
      </div>
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

async function syncToServerDatabase({
  authState,
}: {
  authState: AuthState;
}): Promise<{ state?: string; reloadauth?: boolean }> {
  const response = await fetch(`${ConfigApiSever.URL}/players/sync`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authState.accessToken.accessToken}`,
    },
  });

  if (response.status === 401) {
    return {
      reloadauth: true,
    };
  }

  return { state: "Sync started." };
}
