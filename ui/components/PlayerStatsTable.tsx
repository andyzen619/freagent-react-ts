import type { Player } from "@/types/player";

const STAT_LABELS = [
  "FG%",
  "FT%",
  "3PM",
  "REB",
  "AST",
  "STL",
  "BLK",
  "TO",
  "PTS",
];

export function PlayerStatsTable({
  players,
  statCoverageType = "season",
}: {
  players: Player[];
  statCoverageType: string;
}) {
  if (!players || players.length === 0) {
    return (
      <div className="p-8 text-center border rounded-xl bg-card text-muted-foreground mx-1">
        No player stats available.
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full px-1">
      <h2 className="text-xl font-bold text-primary">
        Player Trends - {statCoverageType}
      </h2>

      <div className="space-y-3 w-full overflow-x-auto">
        {/* Header - Always visible for alignment */}
        <div className="flex items-center gap-1 px-4 py-2 bg-muted/50 rounded-lg text-[10px] font-bold uppercase tracking-wider text-muted-foreground border min-w-max">
          {STAT_LABELS.map((label) => (
            <div key={label} className="w-10 text-center">
              {label}
            </div>
          ))}
        </div>

        {/* Player Rows/Cards */}
        <div className="flex flex-col border rounded-xl divide-y overflow-hidden">
          {players.map((player) => (
            <div key={player.playerStatKey} className="flex flex-col bg-card hover:bg-muted/30 transition-colors">
              {/* Stats Row */}
              <div className="flex items-center gap-1 px-4 pt-1.5 min-w-max">
                <div className="flex items-center gap-1">
                  {STAT_LABELS.map((label) => (
                    <div
                      key={label}
                      className="flex items-center justify-center w-10"
                    >
                      <span className="text-[11px] font-medium text-foreground">
                        {player[label] ?? "-"}
                      </span>
                    </div>
                  ))}
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
