import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ConfigApiSever } from "@/config";
import { useAuthState } from "@/hooks/useAuthState";
import { Button } from "@/components/ui/button";
import { Loader2, Check } from "lucide-react";
import { initiateRequestToken } from "@/lib/auth";

import type { Dispatch, SetStateAction } from "react";
import type { AuthState } from "../hooks/useAuthState";

// Mock data for players with Yahoo Basketball 9 Categories and trend data
const MOCK_PLAYERS = [
  {
    id: "1",
    name: "Nikola Jokic",
    team: "DEN",
    position: "C",
    stats: {
      FG: [55.2, 59.1, 58.3],
      FT: [85.0, 78.5, 81.7],
      "3PM": [0.0, 2.0, 1.1],
      REB: [11.0, 13.5, 12.4],
      AST: [10.0, 8.0, 9.0],
      STL: [1.0, 2.0, 1.4],
      BLK: [1.0, 0.0, 0.9],
      TO: [4.0, 2.0, 3.0],
      PTS: [22.0, 28.5, 26.4],
    },
  },
  {
    id: "2",
    name: "Shai Gilgeous-Alexander",
    team: "OKC",
    position: "PG/SG",
    stats: {
      FG: [51.0, 55.0, 53.5],
      FT: [90.0, 85.0, 87.4],
      "3PM": [1.0, 2.0, 1.3],
      REB: [4.0, 6.0, 5.5],
      AST: [5.0, 7.0, 6.2],
      STL: [3.0, 1.0, 2.0],
      BLK: [0.0, 1.0, 0.9],
      TO: [3.0, 1.0, 2.2],
      PTS: [28.0, 32.0, 30.1],
    },
  },
  {
    id: "3",
    name: "Luka Doncic",
    team: "DAL",
    position: "PG",
    stats: {
      FG: [45.0, 51.0, 48.7],
      FT: [75.0, 82.0, 78.6],
      "3PM": [3.0, 5.0, 4.1],
      REB: [8.0, 10.0, 9.2],
      AST: [11.0, 8.5, 9.8],
      STL: [2.0, 1.0, 1.4],
      BLK: [0.0, 1.0, 0.5],
      TO: [5.0, 3.0, 4.0],
      PTS: [30.0, 35.0, 33.9],
    },
  },
  {
    id: "4",
    name: "Victor Wembanyama",
    team: "SAS",
    position: "PF/C",
    stats: {
      FG: [42.0, 48.0, 46.5],
      FT: [78.0, 81.0, 79.6],
      "3PM": [1.0, 3.0, 1.8],
      REB: [12.0, 9.0, 10.6],
      AST: [2.0, 5.0, 3.9],
      STL: [1.0, 1.5, 1.2],
      BLK: [4.0, 3.0, 3.6],
      TO: [4.0, 3.0, 3.7],
      PTS: [18.0, 24.0, 21.4],
    },
  },
];

const STAT_LABELS = ["FG%", "FT%", "3PM", "REB", "AST", "STL", "BLK", "TO", "PTS"];

function MiniSparkline({ data, color = "currentColor" }: { data: number[], color?: string }) {
  if (!data || data.length < 2) return null;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const width = 60;
  const height = 20;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          className="transition-all duration-300"
        />
        {/* End point dot */}
        <circle 
          cx={(data.length - 1) / (data.length - 1) * width} 
          cy={height - ((data[data.length - 1] - min) / range) * height} 
          r="2" 
          fill={color} 
        />
      </svg>
      <span className="text-xs font-bold">{data[data.length - 1]}</span>
    </div>
  );
}

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

      {/* Player Stats Section - Table Layout with Sparklines */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold px-1 text-primary">Player Trends (Last 3 Games)</h2>
        
        <div className="overflow-x-auto border rounded-xl shadow-sm bg-card">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="text-xs uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-4 py-3 font-bold sticky left-0 bg-muted/50 z-10 min-w-[140px] shadow-[1px_0_0_0_rgba(0,0,0,0.1)]">Player Info</th>
                {STAT_LABELS.map((label) => (
                  <th key={label} className="px-2 py-3 font-bold text-center min-w-[70px]">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {MOCK_PLAYERS.map((player) => (
                <tr key={player.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-4 py-3 sticky left-0 bg-background border-r shadow-[2px_0_8px_-4px_rgba(0,0,0,0.1)] group-hover:bg-muted/30 transition-colors">
                    <div className="flex flex-col min-w-[100px]">
                      <span className="font-bold text-sm leading-tight">{player.name}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-tight font-medium">
                        {player.team} • {player.position}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-center">
                    <MiniSparkline data={player.stats.FG} color="#3b82f6" />
                  </td>
                  <td className="px-2 py-4 text-center">
                    <MiniSparkline data={player.stats.FT} color="#3b82f6" />
                  </td>
                  <td className="px-2 py-4 text-center">
                    <MiniSparkline data={player.stats["3PM"]} color="#8b5cf6" />
                  </td>
                  <td className="px-2 py-4 text-center">
                    <MiniSparkline data={player.stats.REB} color="#10b981" />
                  </td>
                  <td className="px-2 py-4 text-center">
                    <MiniSparkline data={player.stats.AST} color="#f59e0b" />
                  </td>
                  <td className="px-2 py-4 text-center">
                    <MiniSparkline data={player.stats.STL} color="#ef4444" />
                  </td>
                  <td className="px-2 py-4 text-center">
                    <MiniSparkline data={player.stats.BLK} color="#6366f1" />
                  </td>
                  <td className="px-2 py-4 text-center text-destructive">
                    <MiniSparkline data={player.stats.TO} color="#ef4444" />
                  </td>
                  <td className="px-2 py-4 text-center">
                    <MiniSparkline data={player.stats.PTS} color="#3b82f6" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
