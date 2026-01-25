export type PlayerStats = {
  season: string;
  points: number;
  rebounds: number;
  assists: number;
};

export type Player = {
  name: string;
  position: string[];
  stats: PlayerStats[];
};
