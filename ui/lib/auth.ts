import { ConfigYahoo } from "@/config";

/**
 * Redirects the current browser to Yahoo’s request‑token endpoint.
 *
 * The function is synchronous – it just builds the URL and assigns it to
 * `location.href`.  It defaults the `Window` parameter to the global `window`
 * so callers don’t have to pass anything, and it uses the URL/URLSearchParams
 * APIs for clarity.  The `async` was removed since there’s nothing to await.
 *
 * @param win – optional window object (useful for testing); defaults to the
 *              global `window` when available.
 */
export async function initiateRequestToken(
  win: Window = typeof window !== "undefined" ? window : ({} as Window),
) {
  const params = new URLSearchParams({
    client_id: ConfigYahoo.CLIENT_ID,
    redirect_uri: ConfigYahoo.REDIRECT_URL,
    response_type: "code",
    language: "en-us",
  });

  const url = new URL(ConfigYahoo.REQUEST_TOKEN_URL);
  url.search = params.toString();

  win.location.href = url.toString();
}

export function getRequestTokenFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);

  const requestToken = urlParams.get("code");

  if (!requestToken) {
    return { requestToken: "" };
  }

  return { requestToken };
}

export async function getAccessToken(requestToken: string) {
  const body = new URLSearchParams({
    client_id: ConfigYahoo.CLIENT_ID,
    redirect_uri: ConfigYahoo.REDIRECT_URL,
    code: requestToken ?? "",
  });

  const response = await fetch(ConfigYahoo.ACCESS_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`Token request failed: ${response.statusText}`);
  }

  const { access_token: accessToken } = await response.json();

  return { accessToken };
}
