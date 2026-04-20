import React from "react";
import type { SortConfig } from "../../hooks/useTableStats";

interface StatHeaderProps {
  label: string;
  primarySort: SortConfig;
  secondarySort: SortConfig;
  onSort: (label: string) => void;
}

export const StatHeader: React.FC<StatHeaderProps> = ({
  label,
  primarySort,
  secondarySort,
  onSort,
}) => {
  const isPrimary = primarySort.key === label;
  const isSecondary = secondarySort.key === label;

  return (
    <button
      onClick={() => onSort(label)}
      className={`w-10 text-center hover:text-primary transition-colors flex flex-col items-center ${
        isPrimary ? "text-primary bg-primary/10 rounded" : ""
      } ${isSecondary ? "border-b border-primary/40" : ""}`}
    >
      {label}
      <span className="text-[8px]">
        {isPrimary ? (primarySort.direction === "desc" ? "▼" : "▲") : ""}
      </span>
    </button>
  );
};
