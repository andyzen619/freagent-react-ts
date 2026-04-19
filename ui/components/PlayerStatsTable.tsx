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

export function PlayerStatsTable({ players }: { players: Player[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold px-1 text-primary">Player Trends</h2>

      <div className="space-y-3">
        {/* Header - Hidden on Mobile */}
        <div className="hidden md:grid md:grid-cols-[1fr_repeat(9,80px)] items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg text-xs font-bold uppercase tracking-wider text-muted-foreground border">
          <div className="text-left">Player</div>
          {STAT_LABELS.map((label) => (
            <div key={label} className="text-center">
              {label}
            </div>
          ))}
        </div>

        {/* Player Rows/Cards */}
        <div className="space-y-3 md:space-y-1">
          {players.map((player) => (
            <div
              key={player.playerStatKey}
              className="bg-card border rounded-xl p-4 md:p-0 md:rounded-none md:border-x-0 md:border-t-0 md:border-b md:bg-transparent md:grid md:grid-cols-[1fr_repeat(9,80px)] md:items-center md:gap-2 md:px-4 md:py-3 hover:bg-muted/30 transition-colors group"
            >
              {/* Player Name */}
              <div className="mb-3 md:mb-0 border-b pb-2 md:border-0 md:pb-0">
                <span className="text-lg font-bold md:text-sm md:font-medium text-foreground">
                  {player.name}
                </span>
                {player.position && (
                  <span className="ml-2 text-xs text-muted-foreground md:hidden">
                    {player.position}
                  </span>
                )}
              </div>

              {/* Stats Grid - Mobile (3 columns) / Desktop (1 column each) */}
              <div className="grid grid-cols-3 gap-y-3 gap-x-2 md:contents">
                {STAT_LABELS.map((label) => (
                  <div
                    key={label}
                    className="flex flex-col items-center md:items-center justify-center"
                  >
                    <span className="text-[10px] font-bold text-muted-foreground uppercase md:hidden mb-0.5">
                      {label}
                    </span>
                    <span className="text-sm font-semibold md:font-medium">
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
