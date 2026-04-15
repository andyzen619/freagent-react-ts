export interface PlayerModel {
  player_key: string;
  name_full: string;
  name_first: string;
  name_last: string;
  created_at: string; // ISO timestamp string
  updated_at: string; // ISO timestamp string
  status: string;
  eligible_positions: string[]; // Array of strings
  primary_position: string;
}
