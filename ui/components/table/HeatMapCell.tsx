import React from "react";
import { getHeatColor, getTextColor } from "../../lib/color-utils";
import { getNumericVal } from "../../lib/stats-utils";

interface HeatMapCellProps {
  label: string;
  value: any;
  min: number;
  max: number;
  isPrimary?: boolean;
}

export const HeatMapCell: React.FC<HeatMapCellProps> = ({
  label,
  value,
  min,
  max,
  isPrimary,
}) => {
  const num = getNumericVal(value);
  let backgroundColor = "transparent";
  
  if (num !== null) {
    const ratio = max === min ? 0.5 : (num - min) / (max - min);
    backgroundColor = getHeatColor(ratio, label === "TO");
  }

  const textColor = getTextColor(backgroundColor);

  return (
    <div
      className={`flex items-center justify-center w-10 h-6 rounded-sm transition-colors ${
        isPrimary ? "ring-1 ring-primary/30 font-bold" : ""
      }`}
      style={{ backgroundColor, color: textColor }}
    >
      <span className="text-[11px] font-medium">
        {value}
      </span>
    </div>
  );
};
