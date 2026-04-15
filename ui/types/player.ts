export type PlayerStats = {
  points: number;
  rebounds: number;
  assists: number;
  turnovers: number;
  blocks: number;
  steals: number;
  fgPercentage: number;
  ftPercentage: number;
  fgAttempted: number;
  minutesPlayed: number;
};

export type Player = {
  name: string;
  position: string;
  stats: PlayerStats[];
  id: string;
  team: string;
};
