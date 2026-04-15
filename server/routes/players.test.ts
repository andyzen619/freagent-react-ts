import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../server.js';

// Mock the database and player modules
vi.mock('../database/database.js', () => ({
  db: {
    initialize: vi.fn(() => ({
      pgClient: {} // Mock pgClient
    }))
  }
}));

vi.mock('../business/player/index.js', () => ({
  player: {
    getAllWithStats: vi.fn()
  }
}));

import { db } from '../database/database.js';
import { player } from '../business/player/index.js';

describe('GET /players', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 200 and players list on success', async () => {
    const mockPlayers = [
      { name: 'LeBron James', playerStatKey: '466.p.3704' },
      { name: 'Chris Paul', playerStatKey: '466.p.3930' }
    ];

    (player.getAllWithStats as any).mockResolvedValue({ players: mockPlayers });

    const response = await request(app).get('/players');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ players: mockPlayers });
    expect(player.getAllWithStats).toHaveBeenCalledWith({ pgClient: {} });
  });

  it('should return 500 on database error', async () => {
    (player.getAllWithStats as any).mockRejectedValue(new Error('Database connection failed'));

    const response = await request(app).get('/players');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to fetch players' });
  });

  it('should return 401 on authentication error', async () => {
    (player.getAllWithStats as any).mockRejectedValue(new Error('401 Unauthorized'));

    const response = await request(app).get('/players');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Unable to authenticate.' });
  });
});