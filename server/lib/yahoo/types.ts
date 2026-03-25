export interface Types {
  player: Array<Array<any[] | PlayerClass>>;
}

export interface PlayerClass {
  player_key?: string;
  player_id?: string;
  status: string;
  name?: Name;
  url?: string;
  editorial_player_key?: string;
  editorial_team_key?: string;
  editorial_team_full_name?: string;
  editorial_team_abbr?: string;
  editorial_team_url?: string;
  is_keeper?: IsKeeper;
  uniform_number?: string;
  display_position?: string;
  headshot?: Headshot;
  image_url?: string;
  is_undroppable?: string;
  position_type?: string;
  primary_position?: string;
  eligible_positions?: EligiblePosition[];
  eligible_positions_to_add?: EligiblePosition[];
  has_player_notes?: number;
  player_notes_last_timestamp?: number;
  player_stats?: PlayerStats;
  player_advanced_stats?: PlayerStats;
}

export interface PlayerStats {
  0?: Coverage;
  stats: StatWrapper[];
}

export interface Coverage {
  coverage_type: string;
  season?: string;
  date?: string;
}

export interface StatWrapper {
  stat: Stat;
}

export interface Stat {
  stat_id: string;
  value: string;
}

export interface EligiblePosition {
  position: string;
}

export interface Headshot {
  url: string;
  size: string;
}

export interface IsKeeper {
  status: boolean;
  cost: boolean;
  kept: boolean;
}

export interface Name {
  full: string;
  first: string;
  last: string;
  ascii_first: string;
  ascii_last: string;
}
