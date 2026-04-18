import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../server.js";

describe("GET /players Integration", () => {
  it("returns 200 and a list of players (matching curl verification)", async () => {
    const response = await request(app).get("/players");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("players");
    expect(Array.isArray(response.body.players)).toBe(true);

    if (response.body.players.length > 0) {
      const firstPlayer = response.body.players[0];
      expect(firstPlayer).toHaveProperty("name");
      expect(firstPlayer).toHaveProperty("playerStatKey");

      // Check for at least one statistical column (e.g., '1' for GP or similar stat_ids)
      // This is expected to FAIL because the current implementation only returns name and playerStatKey
      const keys = Object.keys(firstPlayer);
      const statKeys = keys.filter(
        (k) => k !== "name" && k !== "playerStatKey",
      );
      expect(statKeys.length).toBeGreaterThan(0);
    }
  });
});
