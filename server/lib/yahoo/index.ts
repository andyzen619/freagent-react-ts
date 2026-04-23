import type { PlayerClass } from "./types.js";

export const YahooApi = {
  getAll: async ({
    token,
    start = 0,
  }: {
    token: string;
    start?: number;
  }): Promise<{
    players: PlayerClass[];
    count: number;
  }> => {
    const response = await fetch(
      `https://fantasysports.yahooapis.com/fantasy/v2/league/nba.l.40314/players;start=${start}?format=json`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );

    if (response.status === 401) {
      throw new Error("Unauthorized 401: Invalid or expired token");
    }

    const data = await response.json();

    const { count, ...objectWithArrayIndexAsKeys } =
      data.fantasy_content.league[1].players;

    const players = toArray(objectWithArrayIndexAsKeys);

    return { players, count: Number(count) };
  },
  getStats: async ({
    token,
    start = 0,
    statsType = "season",
  }: {
    token: string;
    start?: number;
    statsType?: string;
  }): Promise<{
    players: {
      player_key?: string | undefined;
      player_stats?: PlayerClass["player_stats"] | undefined;
      player_advanced_stats?: PlayerClass["player_advanced_stats"] | undefined;
    }[];
    count: number;
  }> => {
    const response = await fetch(
      `https://fantasysports.yahooapis.com/fantasy/v2/league/nba.l.40314/players;out=stats;type=${statsType};start=${start}?format=json`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );

    if (response.status === 401) {
      throw new Error("Unauthorized 401: Invalid or expired token");
    }

    const data = await response.json();

    const { count, ...objectWithArrayIndexAsKeys } =
      data.fantasy_content.league[1].players;

    const players = toArray(objectWithArrayIndexAsKeys);

    return {
      players: players.map((player) => ({
        player_key: player.player_key,
        player_stats: player.player_stats,
        player_advanced_stats: player.player_advanced_stats,
      })),
      count: Number(count),
    };
  },
};

/**
 * Transforms the Yahoo Fantasy API's "object with array index keys" structure into a clean array of Player objects.
 *
 * Yahoo's API returns a collection of players as an object where keys are string indices ("0", "1", "2"...)
 * and the values are complex nested structures containing player metadata.
 *
 * This function:
 * 1. Iterates over the values of the input object.
 * 2. Flattens the nested `player` arrays (which contain mixed arrays of metadata and objects).
 * 3. Merges all properties into a single flat `PlayerClass` object per player.
 *
 * @param objectWithArrayIndexAsKeys - The raw players object from the Yahoo API response (excluding 'count').
 * @returns An array of flattened `PlayerClass` objects.
 */
function toArray(objectWithArrayIndexAsKeys: any): PlayerClass[] {
  return Object.values(objectWithArrayIndexAsKeys)
    .filter((wrapper: any) => wrapper.player)
    .map((wrapper: any) => {
      const playerComponents = wrapper.player;
      const playerObj: any = {};

      if (Array.isArray(playerComponents)) {
        playerComponents.forEach((component) => {
          if (Array.isArray(component)) {
            // This is the array of player metadata objects (key, id, name, etc.)
            component.forEach((subComponent) => {
              if (subComponent && typeof subComponent === "object") {
                Object.assign(playerObj, subComponent);
              }
            });
          } else if (component && typeof component === "object") {
            // This captures the secondary objects like selected_position, starting_status etc.
            Object.assign(playerObj, component);
          }
        });
      }
      return playerObj;
    });
}
