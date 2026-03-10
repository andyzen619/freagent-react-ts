import { XmlDataParser } from "../lib/utils.js";

export const Player = {
  YahooApi: {
    handleResponseError: async (response: Response) => {
      let errorBody = await response.text();

      try {
        errorBody = JSON.parse(errorBody);
      } catch {
        errorBody = await response.text();
      }

      class YahooApiError extends Error {
        errorBody: string;
        constructor(status: number, statusText: string, errorBody: string) {
          super(`${status} ${statusText}`);
          this.name = "YahooApiError";
          this.errorBody = errorBody;
        }
      }

      throw new YahooApiError(response.status, response.statusText, errorBody);
    },
    getAll: async ({ token }: { token: string }) => {
      
      console.log({token});

      const response = await fetch(
        "https://fantasysports.yahooapis.com/fantasy/v2/league/nba.l.40314/players",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        return Player.YahooApi.handleResponseError(response);
      }

      const xmlData = await response.text();

      const { data: players } = XmlDataParser.YahooApi.parse(xmlData);

      return { players };
    },
  },
};
