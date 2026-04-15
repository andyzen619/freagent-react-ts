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

      <div className="overflow-x-auto border rounded-xl shadow-sm bg-card">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-xs uppercase bg-muted/50 border-b">
            <tr>
              <th className="px-4 py-3 font-bold sticky left-0 bg-muted/50 z-10 min-w-[140px] shadow-[1px_0_0_0_rgba(0,0,0,0.1)]">
                Player Info
              </th>
              {STAT_LABELS.map((label) => (
                <th
                  key={label}
                  className="px-2 py-3 font-bold text-center min-w-[70px]"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {players.map((player) => (
              <tr
                key={player.id}
                className="hover:bg-muted/30 transition-colors group"
              >
                <td className="px-4 py-3 sticky left-0 bg-background border-r shadow-[2px_0_8px_-4px_rgba(0,0,0,0.1)] group-hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col min-w-[100px]">
                    <span className="font-bold text-sm leading-tight">
                      {player.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-tight font-medium">
                      {player.team} • {player.position}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
