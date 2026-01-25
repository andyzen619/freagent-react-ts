import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ConfigYahoo } from "@/config";
import { useAuthState } from "@/hooks/useAuthState";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { authState, setAuthState } = useAuthState();

  const initiateRequestToken = async () => {
    const params = new URLSearchParams({
      client_id: ConfigYahoo.CLIENT_ID,
      redirect_uri: ConfigYahoo.REDIRECT_URL,
      response_type: "code",
      language: "en-us",
    });

    const url = ConfigYahoo.REQUEST_TOKEN_URL + "?" + params.toString();

    window.location.href = url;
  };

  useEffect(() => {
    const existingToken = sessionStorage.getItem("access_token");

    if (existingToken) {
      setAuthState((prev) => ({
        ...prev,
        accessToken: { accessToken: existingToken, text: "Authorized!" },
      }));

      return;
    } else {
      setAuthState((prev) => ({
        ...prev,
        reloadAuth: true,
      }));
    }
  }, []);

  type PlayerStats = {
    season: string;
    points: number;
    rebounds: number;
    assists: number;
  };

  type Player = {
    name: string;
    position: string[];
    stats: PlayerStats[];
  };

  const [playersList, setPlayersList] = useState<Player[]>([
    {
      name: "LeBron James",
      position: ["SF", "PF"],
      stats: [
        { season: "2022-23", points: 28.9, rebounds: 8.3, assists: 7.2 },
        { season: "2023-24", points: 25.7, rebounds: 7.3, assists: 8.3 },
      ],
    },
    {
      name: "Stephen Curry",
      position: ["PG", "SG"],
      stats: [
        { season: "2022-23", points: 29.4, rebounds: 6.1, assists: 6.3 },
        { season: "2023-24", points: 26.8, rebounds: 4.5, assists: 5.2 },
      ],
    },
    {
      name: "Giannis Antetokounmpo",
      position: ["PF", "C"],
      stats: [
        { season: "2022-23", points: 31.1, rebounds: 11.8, assists: 7.2 },
        { season: "2023-24", points: 30.2, rebounds: 11.5, assists: 6.4 },
      ],
    },
    {
      name: "Kevin Durant",
      position: ["SF", "PF"],
      stats: [
        { season: "2022-23", points: 29.1, rebounds: 7.4, assists: 5.0 },
        { season: "2023-24", points: 27.1, rebounds: 7.2, assists: 5.0 },
      ],
    },
    {
      name: "Nikola Jokic",
      position: ["C"],
      stats: [
        { season: "2022-23", points: 24.5, rebounds: 11.8, assists: 7.2 },
        { season: "2023-24", points: 26.4, rebounds: 12.4, assists: 7.2 },
      ],
    },
  ]);

  return (
    <div>
      <div>
        AUTH STATUS:
        {authState.requestToken?.text || authState.accessToken?.text}
      </div>
      <div>
        {authState.reloadAuth && (
          <button onClick={() => initiateRequestToken()}>Reload Auth</button>
        )}
      </div>
      <div>
        <div>Players</div>
        <div>{}</div>
      </div>
    </div>
  );
}
