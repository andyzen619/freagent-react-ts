import type { Types } from "./types.ts";

export const YahooApi = {
  getAll: async ({
    token,
  }: {
    token: string;
  }): Promise<{
    players: Types["player"];
    count: Number;
  }> => {
    const response = await fetch(
      "https://fantasysports.yahooapis.com/fantasy/v2/league/nba.l.40314/players?format=json",
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

    const playersList = toArray(objectWithArrayIndexAsKeys);

    return { players: objectWithArrayIndexAsKeys, count };
  },
};

function toArray(objectWithArrayIndexAsKeys: object) {
  const array = Object.values(objectWithArrayIndexAsKeys).map((v: object) => ({
    ...v,
  }));

  return array;
}
