import { Client, DatabaseError as PGError } from "pg";

class DatabaseError extends Error {
  public sql: string;
  public table: string | undefined;

  constructor(params: { sql: string; error: any }) {
    const pgError = params.error as PGError;

    super(pgError.message);
    this.sql = params.sql;
    this.table = pgError.table;
  }
}

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
  Errors: {
    DatabaseError,
  },
};
