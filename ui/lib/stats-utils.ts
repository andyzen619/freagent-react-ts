import type { Player } from "@/types/player";

export const STAT_MAP: Record<string, string[]> = {
  "3PTM": ["3PTM", "3PM", "3P"],
  "ST": ["ST", "STL", "Steals"],
  "BLK": ["BLK", "Blocks"],
  "REB": ["REB", "Rebounds"],
  "AST": ["AST", "Assists"],
  "TO": ["TO", "Turnovers"],
};

export const getStatValue = (player: Player, label: string) => {
  if (player[label] !== undefined) return player[label];
  const alternatives = STAT_MAP[label] || [];
  for (const alt of alternatives) {
    if (player[alt] !== undefined) return player[alt];
  }
  return "-";
};

export const getNumericVal = (val: any) => {
  if (val === "-" || val === null || val === undefined) return null;
  if (typeof val === "string" && val.endsWith("%")) {
    return parseFloat(val) || 0;
  }
  return parseFloat(val as string) || 0;
};
