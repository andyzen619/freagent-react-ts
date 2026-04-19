import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAuthState } from "@/hooks/useAuthState";
import { Button } from "@/components/ui/button";
import { Loader2, Check } from "lucide-react";
import { initiateRequestToken } from "@/lib/auth";
import { syncToServerDatabase, fetchAllPlayers } from "@/lib/playerUtils";
import { PlayerStatsTable } from "@/components/PlayerStatsTable";

import type { Dispatch, SetStateAction } from "react";
import type { AuthState } from "@/hooks/useAuthState";
import type { Player } from "@/types/player";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { authState, setAuthState } = useAuthState();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    checkExistingToken({ setAuthState });
  }, [setAuthState]);

  useEffect(() => {
    fetchAllPlayers().then(({ players }) => {
      if (players && players.length) {
        setPlayers(players);
      }
    });
  }, [authState, setAuthState]);

  return (
    <div className="flex flex-col gap-8 p-4">
      {/* Action Grid */}
      <div className="grid grid-rows-[repeat(2,80px)] grid-flow-col gap-4 overflow-x-auto pb-4 auto-cols-[200px]">
        {authState.reloadAuth ? (
          <Button
            variant="outline"
            className="w-full h-full"
            onClick={() => initiateRequestToken()}
          >
            Reload Auth
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full h-full"
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
      </div>

      <PlayerStatsTable players={players} />
    </div>
  );
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
