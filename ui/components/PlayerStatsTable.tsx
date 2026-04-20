import { useState, useMemo } from "react";
import type { Player } from "@/types/player";

const STAT_LABELS = [
  "FG%",
  "FT%",
  "3PTM",
  "REB",
  "AST",
  "ST",
  "BLK",
  "TO",
  "PTS",
];

// Mapping UI labels to possible Yahoo API display names
const STAT_MAP: Record<string, string[]> = {
  "3PTM": ["3PTM", "3PM", "3P"],
  "ST": ["ST", "STL", "Steals"],
  "BLK": ["BLK", "Blocks"],
  "REB": ["REB", "Rebounds"],
  "AST": ["AST", "Assists"],
  "TO": ["TO", "Turnovers"],
};

type SortConfig = {
  key: string | null;
  direction: "asc" | "desc";
};

export function PlayerStatsTable({
  players,
  statCoverageType = "season",
}: {
  players: Player[];
  statCoverageType: string;
}) {
  const [primarySort, setPrimarySort] = useState<SortConfig>({
    key: null,
    direction: "desc",
  });
  const [secondarySort, setSecondarySort] = useState<SortConfig>({
    key: null,
    direction: "desc",
  });
  const [isCombinedMode, setIsCombinedMode] = useState(false);

  const displayLabels = useMemo(() => {
    const labels = [...STAT_LABELS];
    const result: string[] = [];

    if (primarySort.key) {
      result.push(primarySort.key);
    }
    if (secondarySort.key && secondarySort.key !== primarySort.key) {
      result.push(secondarySort.key);
    }

    const remaining = labels.filter((l) => !result.includes(l));
    return [...result, ...remaining];
  }, [primarySort.key, secondarySort.key]);

  const getStatValue = (player: Player, label: string) => {
    // Try the direct label first
    if (player[label] !== undefined) return player[label];
    
    // Try mapped alternatives
    const alternatives = STAT_MAP[label] || [];
    for (const alt of alternatives) {
      if (player[alt] !== undefined) return player[alt];
    }
    
    return "-";
  };

  const getNumericVal = (val: any) => {
    if (val === "-") return null;
    if (typeof val === "string" && val.endsWith("%")) {
      return parseFloat(val) || 0;
    }
    return parseFloat(val as string) || 0;
  };

  const statsMeta = useMemo(() => {
    const meta: Record<string, { min: number; max: number }> = {};
    STAT_LABELS.forEach((label) => {
      const values = players
        .map((p) => getNumericVal(getStatValue(p, label)))
        .filter((v): v is number => v !== null);
      if (values.length > 0) {
        meta[label] = {
          min: Math.min(...values),
          max: Math.max(...values),
        };
      }
    });
    return meta;
  }, [players]);

  const getHeatColor = (label: string, value: any) => {
    const num = getNumericVal(value);
    if (num === null || !statsMeta[label]) return "transparent";

    const { min, max } = statsMeta[label];
    if (max === min) return "rgba(128, 128, 128, 0.1)";

    // Normalize value between 0 and 1
    let ratio = (num - min) / (max - min);
    
    // Invert for Turnovers - lower is better
    if (label === "TO") {
      ratio = 1 - ratio;
    }

    // Interpolate between Blue (0, 0, 255) and Red (255, 0, 0)
    // ratio 0 = Blue, ratio 1 = Red
    const r = Math.round(255 * ratio);
    const b = Math.round(255 * (1 - ratio));
    const g = 0; // Keeping it simple Red-Blue scale
    
    return `rgba(${r}, ${g}, ${b}, 0.2)`;
  };

  const handleSort = (label: string) => {
    if (primarySort.key === label) {
      if (primarySort.direction === "desc") {
        setPrimarySort({ key: label, direction: "asc" });
      } else {
        setPrimarySort({ key: null, direction: "desc" });
      }
    } else {
      setSecondarySort(primarySort);
      setPrimarySort({ key: label, direction: "desc" });
    }
  };

  const sortedPlayers = useMemo(() => {
    if (!primarySort.key) return players;

    // Helper to get numeric value
    const getVal = (p: Player, label: string) => {
      const val = getStatValue(p, label);
      if (val === "-") return 0;
      if (typeof val === "string" && val.endsWith("%")) {
        return parseFloat(val) || 0;
      }
      return parseFloat(val as string) || 0;
    };

    if (isCombinedMode && secondarySort.key) {
      // Combined Score Algorithm: Normalizing by max value in the current dataset
      const maxPrimary = Math.max(...players.map(p => getVal(p, primarySort.key!))) || 1;
      const maxSecondary = Math.max(...players.map(p => getVal(p, secondarySort.key!))) || 1;

      return [...players].sort((a, b) => {
        const getScore = (p: Player) => {
          let s1 = getVal(p, primarySort.key!) / maxPrimary;
          let s2 = getVal(p, secondarySort.key!) / maxSecondary;
          
          // Invert for Turnovers (TO) since lower is better
          if (primarySort.key === "TO") s1 = 1 - s1;
          if (secondarySort.key === "TO") s2 = 1 - s2;
          
          return s1 + s2;
        };
        return getScore(b) - getScore(a);
      });
    }

    return [...players].sort((a, b) => {
      // Primary sort
      const aPrimary = getVal(a, primarySort.key!);
      const bPrimary = getVal(b, primarySort.key!);

      if (aPrimary !== bPrimary) {
        return primarySort.direction === "desc"
          ? bPrimary - aPrimary
          : aPrimary - bPrimary;
      }

      // Secondary sort
      if (secondarySort.key) {
        const aSecondary = getVal(a, secondarySort.key);
        const bSecondary = getVal(b, secondarySort.key);
        if (aSecondary !== bSecondary) {
          return secondarySort.direction === "desc"
            ? bSecondary - aSecondary
            : aSecondary - bSecondary;
        }
      }

      return 0;
    });
  }, [players, primarySort, secondarySort, isCombinedMode]);

  if (!players || players.length === 0) {
    return (
      <div className="p-8 text-center border rounded-xl bg-card text-muted-foreground mx-1">
        No player stats available.
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full px-1">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary">
            Player Trends - {statCoverageType}
          </h2>
          {secondarySort.key && (
            <button
              onClick={() => setIsCombinedMode(!isCombinedMode)}
              className={`text-[10px] px-2 py-1 rounded border transition-colors ${
                isCombinedMode 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-background text-muted-foreground border-muted hover:border-primary"
              }`}
            >
              {isCombinedMode ? "Combined Mode: ON" : "Combined Mode: OFF"}
            </button>
          )}
        </div>
        {(primarySort.key || secondarySort.key) && (
          <div className="text-[10px] text-muted-foreground flex gap-2">
            {primarySort.key && (
              <span>
                {isCombinedMode ? "Weight 1" : "Primary"}: <span className="text-primary font-bold">{primarySort.key}</span> ({primarySort.direction})
              </span>
            )}
            {secondarySort.key && (
              <span>
                {isCombinedMode ? "Weight 2" : "Secondary"}: <span className="text-primary font-bold">{secondarySort.key}</span> ({secondarySort.direction})
              </span>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3 w-full overflow-x-auto">
        {/* Header - Always visible for alignment */}
        <div className="flex items-center gap-1 px-4 py-2 bg-muted/50 rounded-lg text-[10px] font-bold uppercase tracking-wider text-muted-foreground border min-w-max">
          {displayLabels.map((label) => (
            <button
              key={label}
              onClick={() => handleSort(label)}
              className={`w-10 text-center hover:text-primary transition-colors flex flex-col items-center ${
                primarySort.key === label ? "text-primary bg-primary/10 rounded" : ""
              } ${secondarySort.key === label ? "border-b border-primary/40" : ""}`}
            >
              {label}
              <span className="text-[8px]">
                {primarySort.key === label ? (primarySort.direction === "desc" ? "▼" : "▲") : ""}
              </span>
            </button>
          ))}
        </div>

        {/* Player Rows/Cards */}
        <div className="flex flex-col border rounded-xl divide-y overflow-hidden">
          {sortedPlayers.map((player) => (
            <div key={player.playerStatKey} className="flex flex-col bg-card hover:bg-muted/30 transition-colors">
              {/* Stats Row */}
              <div className="flex items-center gap-1 px-4 pt-1.5 min-w-max">
                <div className="flex items-center gap-1">
                  {displayLabels.map((label) => {
                    const val = getStatValue(player, label);
                    return (
                      <div
                        key={label}
                        className={`flex items-center justify-center w-10 h-6 rounded-sm transition-colors ${
                          primarySort.key === label ? "ring-1 ring-primary/30 font-bold" : ""
                        }`}
                        style={{ backgroundColor: getHeatColor(label, val) }}
                      >
                        <span className="text-[11px] font-medium text-foreground">
                          {val}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Player Name Row - Below */}
              <div className="px-4 pb-1.5 text-[10px] font-bold text-primary/80 uppercase tracking-tight">
                {player.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
