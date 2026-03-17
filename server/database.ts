import { Client } from "pg";

export const db = {
  initialize(): {
    pgClient: Client;
  } {
    const pgClient = new Client({
      host: "localhost",
      port: 5433,
      user: "freagent",
      password: "durant",
      database: "freagent_db",
    });

    pgClient.connect();

    return {
      pgClient,
    };
  },
};
