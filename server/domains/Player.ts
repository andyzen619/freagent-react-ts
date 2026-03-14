import { XmlDataParser } from "../lib/utils.js";

interface YahooApiPlayer {
  firstName: string;
}

export const Player = {
  YahooApi: {
    getAll: async ({ token }: { token: string }) => {
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

      const data = await response.json();

      return { players: [] };
    },
  },
};
