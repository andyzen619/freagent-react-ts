import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ConfigYahoo } from "@/config";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [authState, setAuthState] = useState<any>({
    accessToken: "",
    requestToken: "",
    reloadAuth: false,
  });

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
      setAuthState((prev: any) => ({
        ...prev,
        accessToken: { accessToken: existingToken, text: "Authorized!" },
      }));

      return;
    } else {
      setAuthState((prev: any) => ({
        ...prev,
        reloadAuth: true,
      }));
    }
  }, []);

  return (
    <div>
      AUTH STATUS: {authState.requestToken?.text ?? authState.accessToken?.text}
      {authState.reloadAuth && (
        <button
          onClick={() => {
            initiateRequestToken();
          }}
        >
          Reload Auth
        </button>
      )}
    </div>
  );
}
