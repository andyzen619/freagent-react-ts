export const ConfigUI = {
  URL_PREFIX: "2e7f-70-53-83-74",
};

export const ConfigApiSever = {
  URL: "http://andyomarchy.local:3000",
};

export const ConfigYahoo = {
  CLIENT_ID:
    "dj0yJmk9SU1YYkZTT2pmRVM4JmQ9WVdrOWRVWjJibmxzYTFJbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWRj",
  REQUEST_TOKEN_URL: "https://api.login.yahoo.com/oauth2/request_auth",
  REDIRECT_URL: `https://${ConfigUI.URL_PREFIX}.ngrok-free.app/oauth_callback`,
  ACCESS_TOKEN_URL: `${ConfigApiSever.URL}/get_token`,
};
