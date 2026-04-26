import type { Player } from "@/types/player";
import { useTableStats } from "../hooks/useTableStats";
import { getStatValue } from "../lib/stats-utils";
import { HeatMapCell } from "./table/HeatMapCell";
import { StatHeader } from "./table/StatHeader";
import { CoverageSelector, type CoverageType } from "./table/CoverageSelector";

const DEFAULT_STAT_LABELS = [
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

export function PlayerStatsTable({
  players,
  statCoverageType = "season",
  onCoverageChange,
}: {
  players: Player[];
  statCoverageType: string;
  onCoverageChange?: (coverage: CoverageType) => void;
}) {
  const {
    primarySort,
    secondarySort,
    isCombinedMode,
    displayLabels,
    statsMeta,
    sortedPlayers,
    handleSort,
  } = useTableStats(players, DEFAULT_STAT_LABELS);

  return (
    <div className="space-y-4 w-full px-1">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-primary">Player Trends</h2>
          <div className="flex items-center gap-2">
            {onCoverageChange && (
              <CoverageSelector
                currentCoverage={statCoverageType}
                onCoverageChange={onCoverageChange}
              />
            )}
          </div>
        </div>
        {(primarySort.key || secondarySort.key) && (
          <div className="text-[10px] text-muted-foreground flex gap-2">
            {primarySort.key && (
              <span>
                {isCombinedMode ? "Weight 1" : "Primary"}:{" "}
                <span className="text-primary font-bold">
                  {primarySort.key}
                </span>{" "}
                ({primarySort.direction})
              </span>
            )}
            {secondarySort.key && (
              <span>
                {isCombinedMode ? "Weight 2" : "Secondary"}:{" "}
                <span className="text-primary font-bold">
                  {secondarySort.key}
                </span>{" "}
                ({secondarySort.direction})
              </span>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3 w-full overflow-x-auto">
        {/* Header */}
        <div className="flex items-center gap-1 px-4 py-2 bg-muted/50 rounded-lg text-[10px] font-bold uppercase tracking-wider text-muted-foreground border min-w-max">
          {displayLabels.map((label) => (
            <StatHeader
              key={label}
              label={label}
              primarySort={primarySort}
              secondarySort={secondarySort}
              onSort={handleSort}
            />
          ))}
        </div>
        {/* Player Rows */}
        <div className="flex flex-col border rounded-xl divide-y overflow-hidden">
          {sortedPlayers.map((player) => (
            <div
              key={player.playerStatKey}
              className="flex flex-col bg-card hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-1 px-4 pt-1.5 min-w-max">
                <div className="flex items-center gap-1">
                  {displayLabels.map((label) => {
                    const val = getStatValue(player, label);
                    const meta = statsMeta[label] || { min: 0, max: 0 };
                    return (
                      <HeatMapCell
                        key={label}
                        label={label}
                        value={val}
                        min={meta.min}
                        max={meta.max}
                        isPrimary={primarySort.key === label}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Player Name Row */}
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
