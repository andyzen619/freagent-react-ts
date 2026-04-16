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
      expect(response.body.players[0]).toHaveProperty("name");
      expect(response.body.players[0]).toHaveProperty("playerStatKey");
    }
  });
});
