import { useEffect, useState, useRef } from "react";
import type { Player } from "@/types/player";

const PlayersList = () => {
  const [playersList, setPlayersList] = useState<Player[]>([
    {
      name: "LeBron James",
      position: ["SF", "PF"],
      stats: [
        {
          season: "2022-23",
          points: 28.9,
          rebounds: 8.3,
          assists: 7.2,
          turnovers: 3.2,
          blocks: 0.6,
          steals: 1.2,
          fgPercentage: 0.5,
          ftPercentage: 0.768,
          fgAttempted: 15.2,
          minutesPlayed: 35.5,
        },
        {
          season: "2023-24",
          points: 25.7,
          rebounds: 7.3,
          assists: 8.3,
          turnovers: 3.0,
          blocks: 0.5,
          steals: 1.1,
          fgPercentage: 0.52,
          ftPercentage: 0.75,
          fgAttempted: 14.8,
          minutesPlayed: 34.2,
        },
      ],
    },
    {
      name: "Stephen Curry",
      position: ["PG", "SG"],
      stats: [
        {
          season: "2022-23",
          points: 29.4,
          rebounds: 6.1,
          assists: 6.3,
          turnovers: 3.2,
          blocks: 0.4,
          steals: 1.8,
          fgPercentage: 0.437,
          ftPercentage: 0.907,
          fgAttempted: 20.2,
          minutesPlayed: 34.7,
        },
        {
          season: "2023-24",
          points: 26.8,
          rebounds: 4.5,
          assists: 5.2,
          turnovers: 2.8,
          blocks: 0.3,
          steals: 1.6,
          fgPercentage: 0.45,
          ftPercentage: 0.923,
          fgAttempted: 19.5,
          minutesPlayed: 32.8,
        },
      ],
    },
    {
      name: "Giannis Antetokounmpo",
      position: ["PF", "C"],
      stats: [
        {
          season: "2022-23",
          points: 31.1,
          rebounds: 11.8,
          assists: 7.2,
          turnovers: 3.9,
          blocks: 1.1,
          steals: 1.2,
          fgPercentage: 0.553,
          ftPercentage: 0.645,
          fgAttempted: 18.2,
          minutesPlayed: 32.1,
        },
        {
          season: "2023-24",
          points: 30.2,
          rebounds: 11.5,
          assists: 6.4,
          turnovers: 3.5,
          blocks: 1.0,
          steals: 1.1,
          fgPercentage: 0.611,
          ftPercentage: 0.657,
          fgAttempted: 17.8,
          minutesPlayed: 32.5,
        },
      ],
    },
    {
      name: "Kevin Durant",
      position: ["SF", "PF"],
      stats: [
        {
          season: "2022-23",
          points: 29.1,
          rebounds: 7.4,
          assists: 5.0,
          turnovers: 3.3,
          blocks: 1.5,
          steals: 1.1,
          fgPercentage: 0.56,
          ftPercentage: 0.919,
          fgAttempted: 17.2,
          minutesPlayed: 36.8,
        },
        {
          season: "2023-24",
          points: 27.1,
          rebounds: 7.2,
          assists: 5.0,
          turnovers: 3.0,
          blocks: 1.3,
          steals: 0.9,
          fgPercentage: 0.523,
          ftPercentage: 0.856,
          fgAttempted: 16.5,
          minutesPlayed: 35.2,
        },
      ],
    },
    {
      name: "Nikola Jokic",
      position: ["C"],
      stats: [
        {
          season: "2022-23",
          points: 24.5,
          rebounds: 11.8,
          assists: 7.2,
          turnovers: 3.6,
          blocks: 0.7,
          steals: 1.3,
          fgPercentage: 0.632,
          ftPercentage: 0.822,
          fgAttempted: 12.4,
          minutesPlayed: 33.7,
        },
        {
          season: "2023-24",
          points: 26.4,
          rebounds: 12.4,
          assists: 7.2,
          turnovers: 3.0,
          blocks: 0.9,
          steals: 1.4,
          fgPercentage: 0.583,
          ftPercentage: 0.817,
          fgAttempted: 13.2,
          minutesPlayed: 34.6,
        },
      ],
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState("2022-23");
  const playersContainerRef = useRef<HTMLDivElement>(null);

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
              <th>Turnovers</th>
              <th>Blocks</th>
              <th>Steals</th>
              <th>FG %</th>
              <th>FT %</th>
              <th>FG Attempted</th>
              <th>Minutes Played</th>
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
                    <td>{stat.turnovers}</td>
                    <td>{stat.blocks}</td>
                    <td>{stat.steals}</td>
                    <td>{(stat.fgPercentage * 100).toFixed(1)}%</td>
                    <td>{(stat.ftPercentage * 100).toFixed(1)}%</td>
                    <td>{stat.fgAttempted}</td>
                    <td>{stat.minutesPlayed}</td>
                  </tr>
                )),
            )}
            {loading && (
              <tr>
                <td colSpan={12}>Loading more players...</td>
              </tr>
            )}
            {!hasMore && (
              <tr>
                <td colSpan={12}>No more players to load.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayersList;
