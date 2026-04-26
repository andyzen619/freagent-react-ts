import { useState, useMemo } from "react";
import type { Player } from "@/types/player";
import { getStatValue, getNumericVal } from "../lib/stats-utils";

export type SortConfig = {
  key: string | null;
  direction: "asc" | "desc";
};

export function useTableStats(players: Player[], statLabels: string[]) {
  const [primarySort, setPrimarySort] = useState<SortConfig>({
    key: null,
    direction: "desc",
  });
  const [secondarySort, setSecondarySort] = useState<SortConfig>({
    key: null,
    direction: "desc",
  });
  const [isCombinedMode, setIsCombinedMode] = useState(true);

  const displayLabels = useMemo(() => {
    const result: string[] = [];

    if (primarySort.key) {
      result.push(primarySort.key);
    }

    if (secondarySort.key && secondarySort.key !== primarySort.key) {
      result.push(secondarySort.key);
    }

    const remaining = statLabels.filter((l) => !result.includes(l));

    return [...result, ...remaining];
  }, [statLabels, primarySort.key, secondarySort.key]);

  const statsMeta = useMemo(() => {
    const meta: Record<string, { min: number; max: number }> = {};

    statLabels.forEach((label) => {
      const values = players
        .map((p) => getNumericVal(getStatValue(p, label)))
        .filter((v): v is number => v !== null);

      if (values.length > 0) {
        meta[label] = {
          min: Math.min(...values),
          max: Math.max(...values),
        };
      }
    });
    return meta;
  }, [players, statLabels]);

  const sortedPlayers = useMemo(() => {
    if (!primarySort.key) {
      return players;
    }

    const getVal = (p: Player, label: string) => {
      const val = getStatValue(p, label);
      const num = getNumericVal(val);
      return num === null ? (isCombinedMode ? 0 : -Infinity) : num;
    };

    const maxPrimary = statsMeta[primarySort.key!]?.max || 1;
    const maxSecondary = statsMeta[secondarySort.key!]?.max || 1;

    return [...players].sort((a, b) => {
      const getScore = (p: Player) => {
        let s1 = getVal(p, primarySort.key!) / maxPrimary;
        let s2 = getVal(p, secondarySort.key!) / maxSecondary;
        if (primarySort.key === "TO") s1 = 1 - s1;
        if (secondarySort.key === "TO") s2 = 1 - s2;
        return s1 + s2;
      };
      return getScore(b) - getScore(a);
    });
  }, [players, primarySort, secondarySort, isCombinedMode, statsMeta]);

  const handleSort = (label: string) => {
    if (primarySort.key === label) {
      if (primarySort.direction === "desc") {
        setPrimarySort({ key: label, direction: "asc" });
      } else {
        setPrimarySort({ key: null, direction: "desc" });
      }
    } else {
      setSecondarySort(primarySort);
      setPrimarySort({ key: label, direction: "desc" });
    }
  };

  return {
    primarySort,
    secondarySort,
    isCombinedMode,
    setIsCombinedMode,
    displayLabels,
    statsMeta,
    sortedPlayers,
    handleSort,
  };
}
