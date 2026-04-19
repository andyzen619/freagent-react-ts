export const ConfigUI = {
  URL_PREFIX: "1be8-70-53-83-74",
};

export const ConfigYahoo = {
  CLIENT_ID:
    "dj0yJmk9SU1YYkZTT2pmRVM4JmQ9WVdrOWRVWjJibmxzYTFJbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWRj",
  REQUEST_TOKEN_URL: "https://api.login.yahoo.com/oauth2/request_auth",
  REDIRECT_URL: `https://${ConfigUI.URL_PREFIX}.ngrok-free.app/oauth_callback`,
  ACCESS_TOKEN_URL: "http://localhost:3000/get_token",
};

export const ConfigApiSever = {
  URL: "http://localhost:3000",
};
