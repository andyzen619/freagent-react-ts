import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "./database.js";
import { databseUtils } from "./utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
  // Initialize DB connection
  const { pgClient } = db.initialize();

  try {
    // 1. Ensure migrations table exists
    await pgClient.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Get list of already applied migrations
    const { rows: appliedRows } = await pgClient.query(
      "SELECT name FROM migrations",
    );
    const appliedMigrations = new Set(appliedRows.map((row) => row.name));

    // 3. Get list of migration files from 'server/migrations'
    const migrationsDir = path.join(__dirname, "migrations");
    if (!fs.existsSync(migrationsDir)) {
      console.log(`Creating migrations directory at ${migrationsDir}`);
      fs.mkdirSync(migrationsDir);
    }

    const files = fs.readdirSync(migrationsDir).sort();

    // 4. Run pending migrations
    for (const file of files) {
      if (!file.endsWith(".sql")) {
        continue;
      }

      if (!appliedMigrations.has(file)) {
        console.log(`Running migration: ${file}`);
        const filePath = path.join(migrationsDir, file);
        const sql = await databseUtils.loadSqlFile(filePath);

        try {
          await pgClient.query("BEGIN");
          await pgClient.query(sql);
          await pgClient.query("INSERT INTO migrations (name) VALUES ($1)", [
            file,
          ]);
          await pgClient.query("COMMIT");
          console.log(`Successfully applied: ${file}`);
        } catch (err) {
          await pgClient.query("ROLLBACK");
          console.error(`Error applying migration ${file}:`);
          console.error(err);
          process.exit(1);
        }
      }
    }

    console.log("All migrations are up to date.");
  } catch (err) {
    console.error("Migration script failed:", err);
    process.exit(1);
  } finally {
    await pgClient.end();
  }
}

migrate();
