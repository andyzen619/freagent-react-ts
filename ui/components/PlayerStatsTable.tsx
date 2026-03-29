export const STAT_LABELS = ["FG%", "FT%", "3PM", "REB", "AST", "STL", "BLK", "TO", "PTS"];

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

export interface Player {
  id: string;
  name: string;
  team: string;
  position: string;
  stats: Record<string, number[]>;
}

export function PlayerStatsTable({ players }: { players: Player[] }) {
  return (
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
            {players.map((player) => (
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
  );
}
