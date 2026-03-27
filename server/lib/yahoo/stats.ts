export enum YahooStatId {
  /** Games Played */
  GP = "0",
  /** Games Started */
  GS = "1",
  /** Minutes Played */
  MIN = "2",
  /** Field Goals Attempted */
  FGA = "3",
  /** Field Goals Made */
  FGM = "4",
  /** Field Goal Percentage */
  FG_PCT = "5",
  /** Free Throws Attempted */
  FTA = "6",
  /** Free Throws Made */
  FTM = "7",
  /** Free Throw Percentage */
  FT_PCT = "8",
  /** 3-point Shots Attempted */
  PTA3 = "9",
  /** 3-point Shots Made */
  PTM3 = "10",
  /** 3-point Percentage */
  PT_PCT3 = "11",
  /** Points Scored */
  PTS = "12",
  /** Offensive Rebounds */
  OREB = "13",
  /** Defensive Rebounds */
  DREB = "14",
  /** Total Rebounds */
  REB = "15",
  /** Assists */
  AST = "16",
  /** Steals */
  ST = "17",
  /** Blocked Shots */
  BLK = "18",
  /** Turnovers */
  TO = "19",
  /** Assist/Turnover Ratio */
  AT_RATIO = "20",
  /** Personal Fouls */
  PF = "21",
  /** Times Fouled Out */
  DISQ = "22",
  /** Technical Fouls */
  TECH = "23",
  /** Ejections */
  EJCT = "24",
  /** Flagrant Fouls */
  FF = "25",
  /** Minutes Per Game */
  MPG = "26",
  /** Double-Doubles */
  DD = "27",
  /** Triple-Doubles */
  TD = "28",

  // Advanced Stats (Extrapolated from the stats response IDs like 1001, 1011, etc.)
  /** Effective Field Goal Percentage */
  EFG_PCT = "1001",
  /** True Shooting Percentage */
  TS_PCT = "1006",
  /** Usage Rate */
  USG_PCT = "1007",
  /** Offensive Rating */
  ORtg = "1008",
  /** Defensive Rating */
  DRtg = "1011",
  /** Player Efficiency Rating */
  PER = "1012",
  /** Win Shares */
  WS = "1013",

  // Composite/Draft IDs (Used in some contexts)
  FGM_FGA = "9004003",
  FTM_FTA = "9007006",
}

export const YahooStatNameMap: Record<string, string> = {
  "0": "Games Played",
  "1": "Games Started",
  "2": "Minutes Played",
  "3": "Field Goals Attempted",
  "4": "Field Goals Made",
  "5": "Field Goal Percentage",
  "6": "Free Throws Attempted",
  "7": "Free Throws Made",
  "8": "Free Throw Percentage",
  "9": "3-point Shots Attempted",
  "10": "3-point Shots Made",
  "11": "3-point Percentage",
  "12": "Points Scored",
  "13": "Offensive Rebounds",
  "14": "Defensive Rebounds",
  "15": "Total Rebounds",
  "16": "Assists",
  "17": "Steals",
  "18": "Blocked Shots",
  "19": "Turnovers",
  "20": "Assist/Turnover Ratio",
  "21": "Personal Fouls",
  "22": "Times Fouled Out",
  "23": "Technical Fouls",
  "24": "Ejections",
  "25": "Flagrant Fouls",
  "26": "Minutes Per Game",
  "27": "Double-Doubles",
  "28": "Triple-Doubles",
  "1001": "Effective Field Goal Percentage",
  "1006": "True Shooting Percentage",
  "1007": "Usage Rate",
  "1008": "Offensive Rating",
  "1011": "Defensive Rating",
  "1012": "Player Efficiency Rating",
  "1013": "Win Shares",
  "9004003": "Field Goals Made / Attempted",
  "9007006": "Free Throws Made / Attempted",
};
