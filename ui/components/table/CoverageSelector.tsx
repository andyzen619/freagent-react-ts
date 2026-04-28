import React from "react";

export type CoverageType = "season" | "average_season" | "last7";

interface CoverageSelectorProps {
  currentCoverage: string;
  onCoverageChange: (coverage: CoverageType) => void;
}

export const CoverageSelector: React.FC<CoverageSelectorProps> = ({
  currentCoverage,
  onCoverageChange,
}) => {
  const options: { label: string; value: CoverageType }[] = [
    { label: "Season Totals", value: "season" },
    { label: "Season Averages", value: "average_season" },
    { label: "Last 7 Days", value: "last7" },
  ];

  return (
    <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-lg border">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onCoverageChange(option.value)}
          className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
            currentCoverage === option.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
