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

      <div className="space-y-3 w-full">
        {/* Header - Hidden on Mobile */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg text-xs font-bold uppercase tracking-wider text-muted-foreground border">
          <div className="flex-1 min-w-[150px]">Player</div>
          {STAT_LABELS.map((label) => (
            <div key={label} className="w-16 text-center">
              {label}
            </div>
          ))}
        </div>

        {/* Player Rows/Cards */}
        <div className="flex flex-col gap-3 md:gap-0">
          {players.map((player) => (
            <div
              key={player.playerStatKey}
              className="bg-card border rounded-xl p-4 md:p-0 md:rounded-none md:border-x-0 md:border-t-0 md:border-b md:bg-transparent flex flex-col md:flex-row md:items-center md:gap-2 md:px-4 md:py-3 hover:bg-muted/30 transition-colors w-full"
            >
              {/* Player Name Section */}
              <div className="mb-3 md:mb-0 border-b pb-2 md:border-0 md:pb-0 flex-1 md:min-w-[150px]">
                <div className="text-lg font-bold md:text-sm md:font-semibold text-foreground truncate">
                  {player.name}
                </div>
                {player.position && (
                  <div className="text-xs text-muted-foreground md:hidden">
                    {player.position}
                  </div>
                )}
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-y-4 gap-x-2 md:flex md:items-center md:gap-2">
                {STAT_LABELS.map((label) => (
                  <div
                    key={label}
                    className="flex flex-col items-center justify-center md:w-16"
                  >
                    <span className="text-[10px] font-bold text-muted-foreground uppercase md:hidden mb-0.5">
                      {label}
                    </span>
                    <span className="text-sm font-semibold md:font-medium text-foreground">
                      {player[label] ?? "-"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
