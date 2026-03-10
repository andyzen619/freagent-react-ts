import { useState } from "react";

export interface AuthState {
  accessToken: { accessToken: string; text: string };
  requestToken: { requestToken: string; text: string };
  reloadAuth: boolean;
}

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({
    accessToken: { accessToken: "", text: "" },
    requestToken: { requestToken: "", text: "" },
    reloadAuth: false,
  });

  return { authState, setAuthState };
};
