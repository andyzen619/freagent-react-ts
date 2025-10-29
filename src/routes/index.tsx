import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [authState, setAuthState] = useState<any>({
    accessToken: "",
    requestToken: "",
    reloadAuth: false,
  });

  useEffect(() => {
    const existingToken = sessionStorage.getItem("access_token");

    if (existingToken) {
      setAuthState((prev: any) => ({
        ...prev,
        accessToken: { accessToken: existingToken, text: "Authorized!" },
      }));

      return;
    }
  }, []);

  return (
    <div>
      AUTH STATUS: {authState.requestToken?.text ?? authState.accessToken?.text}
      {authState.reloadAuth && (
        <button onClick={() => (window.location.href = "/")}>
          Reload Auth
        </button>
      )}
    </div>
  );
}
