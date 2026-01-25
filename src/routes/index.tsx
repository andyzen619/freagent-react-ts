import { useEffect, useState, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ConfigYahoo } from "@/config";
import { useAuthState } from "@/hooks/useAuthState";
import type { Player } from "@/types/player";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { authState, setAuthState } = useAuthState();
  const playersContainerRef = useRef<HTMLDivElement>(null);

  const initiateRequestToken = async () => {
    const params = new URLSearchParams({
      client_id: ConfigYahoo.CLIENT_ID,
      redirect_uri: ConfigYahoo.REDIRECT_URL,
      response_type: "code",
      language: "en-us",
    });

    const url = ConfigYahoo.REQUEST_TOKEN_URL + "?" + params.toString();

    window.location.href = url;
  };

  useEffect(() => {
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
  }, []);

  const [playersList, setPlayersList] = useState<Player[]>([
    {
      name: "LeBron James",
      position: ["SF", "PF"],
      stats: [
        { season: "2022-23", points: 28.9, rebounds: 8.3, assists: 7.2 },
        { season: "2023-24", points: 25.7, rebounds: 7.3, assists: 8.3 },
      ],
    },
    {
      name: "Stephen Curry",
      position: ["PG", "SG"],
      stats: [
        { season: "2022-23", points: 29.4, rebounds: 6.1, assists: 6.3 },
        { season: "2023-24", points: 26.8, rebounds: 4.5, assists: 5.2 },
      ],
    },
    {
      name: "Giannis Antetokounmpo",
      position: ["PF", "C"],
      stats: [
        { season: "2022-23", points: 31.1, rebounds: 11.8, assists: 7.2 },
        { season: "2023-24", points: 30.2, rebounds: 11.5, assists: 6.4 },
      ],
    },
    {
      name: "Kevin Durant",
      position: ["SF", "PF"],
      stats: [
        { season: "2022-23", points: 29.1, rebounds: 7.4, assists: 5.0 },
        { season: "2023-24", points: 27.1, rebounds: 7.2, assists: 5.0 },
      ],
    },
    {
      name: "Nikola Jokic",
      position: ["C"],
      stats: [
        { season: "2022-23", points: 24.5, rebounds: 11.8, assists: 7.2 },
        { season: "2023-24", points: 26.4, rebounds: 12.4, assists: 7.2 },
      ],
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState("2022-23");

  const loadMore = () => {
    if (loading || !hasMore) return;
    setLoading(true);
    // Simulate API fetch with timeout; replace with actual fetch
    setTimeout(() => {
      const newPlayers: Player[] = [
        // Duplicate or add new players here; for demo, duplicating existing
        ...playersList
          .slice(0, 5)
          .map((p, i) => ({ ...p, name: `${p.name} ${i + 1}` })),
      ];
      setPlayersList((prev) => [...prev, ...newPlayers]);
      setLoading(false);
      if (playersList.length + newPlayers.length >= 50) setHasMore(false);
    }, 1000);
  };

  const handleScroll = () => {
    const container = playersContainerRef.current;
    if (container) {
      const { scrollTop, clientHeight, scrollHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadMore();
      }
    }
  };

  useEffect(() => {
    const container = playersContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [loading, hasMore]);

  const seasons = Array.from(
    new Set(
      playersList.flatMap((player) => player.stats.map((stat) => stat.season)),
    ),
  );

  return (
    <div>
      <div>
        AUTH STATUS:{" "}
        {authState.requestToken?.text || authState.accessToken?.text}
      </div>
      <div>
        {authState.reloadAuth && (
          <button onClick={() => initiateRequestToken()}>Reload Auth</button>
        )}
      </div>
      <div>
        <div>Players</div>
        <div>
          <label htmlFor="season-select">Select Season:</label>
          <select
            id="season-select"
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
          >
            {seasons.map((season) => (
              <option key={season} value={season}>
                {season}
              </option>
            ))}
          </select>
        </div>
        <div
          ref={playersContainerRef}
          style={{ height: "400px", overflowY: "auto" }} // Add height and scroll for demo; style with Tailwind later
        >
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Points</th>
                <th>Rebounds</th>
                <th>Assists</th>
              </tr>
            </thead>
            <tbody>
              {playersList.map((player) =>
                player.stats
                  .filter((stat) => stat.season === selectedSeason)
                  .map((stat) => (
                    <tr key={`${player.name}-${stat.season}`}>
                      <td>{player.name}</td>
                      <td>{player.position.join(", ")}</td>
                      <td>{stat.points}</td>
                      <td>{stat.rebounds}</td>
                      <td>{stat.assists}</td>
                    </tr>
                  )),
              )}
              {loading && (
                <tr>
                  <td colSpan={5}>Loading more players...</td>
                </tr>
              )}
              {!hasMore && (
                <tr>
                  <td colSpan={5}>No more players to load.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
