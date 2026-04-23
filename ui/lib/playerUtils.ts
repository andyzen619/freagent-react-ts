import { ConfigApiSever } from "@/config";
import type { AuthState } from "@/hooks/useAuthState";
import type { Player } from "@/types/player";

export const MOCK_PLAYERS = [
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

export async function syncToServerDatabase({
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

export async function fetchAllPlayers(coverageType?: string): Promise<{ players?: Player[] }> {
  const url = new URL(`${ConfigApiSever.URL}/players`);
  if (coverageType) {
    url.searchParams.append("coverage_type", coverageType);
  }

  const response = await fetch(url.toString(), {
    method: "GET",
  });

  const { players } = await response.json();

  return { players };
}
