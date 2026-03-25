import { createFileRoute } from "@tanstack/react-router";
import { useAuthState } from "@/hooks/useAuthState";
import { useEffect, useState, useCallback } from "react";
import { OAuthAuthenticationCard } from "@/components/OAuthAuthenticationCard";
import {
  initiateRequestToken,
  getRequestTokenFromUrl,
  getAccessToken,
} from "@/lib/auth";

export const Route = createFileRoute("/oauth_callback")({
  component: RouteComponent,
});

function RouteComponent() {
  const { authState, setAuthState } = useAuthState();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { requestToken } = getRequestTokenFromUrl();

    if (!requestToken) {
      setError("No request token found in URL.");
      return;
    }

    setAuthState((prev) => ({
      ...prev,
      requestToken: { requestToken, text: "Requesting access...." },
    }));

    getAccessToken(requestToken)
      .then(({ accessToken }) => {
        setAuthState((prev) => ({
          ...prev,
          accessToken: { accessToken, text: "Authorized!" },
        }));

        sessionStorage.setItem("access_token", accessToken);
      })
      .catch((err) => {
        setAuthState((prev) => ({ ...prev, reloadAuth: true }));
        setError(err.message);
      });
  }, [setAuthState]);

  const handleRetry = useCallback(() => {
    initiateRequestToken();
  }, []);

  return (
    <div className="flex h-[80vh] w-full items-center justify-center p-4">
      <OAuthAuthenticationCard
        loading={!error && authState.accessToken?.text !== "Authorized!"}
        error={error}
        success={authState.accessToken?.text === "Authorized!"}
        onRetry={handleRetry}
      />
    </div>
  );
}
