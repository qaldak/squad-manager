import request from "supertest";
import express from "express";
import playersData from "../__mocks__/mock.players";
import playerRoutes from "../../src/routes/player.routes";
import { Position } from "../../src/models/Player";
import { jest, describe, it, expect } from "@jest/globals";

// Mock db
jest.mock("@supabase/supabase-js", () => {
  return {
    createClient: () => {
      return {
        from: jest.fn(() => ({
          select: jest.fn(() => {
            return {
              eq: jest.fn((column, value: string) => {
                if (column === "id") {
                  const player = playersData.readPlayer(value);
                  return Promise.resolve({
                    data: player ? [player] : [],
                    error: null,
                  });
                }
              }),
              then: jest.fn(
                (callback: (result: { data: any[]; error: null }) => void) => {
                  const players = playersData.getPlayers();
                  return callback({
                    data: players,
                    error: null,
                  });
                },
              ),
            };
          }),
          update: jest.fn((data) => {
            const updatedPlayer = playersData.updatePlayer(data);
            return {
              eq: jest.fn(() => {
                return {
                  select: jest.fn(() => {
                    return Promise.resolve({
                      data: [updatedPlayer],
                      error: null,
                    });
                  }),
                };
              }),
            };
          }),
          insert: jest.fn((data) => {
            const newPlayer = playersData.addPlayer(data);
            return {
              select: jest.fn(() => {
                return Promise.resolve({
                  data: [newPlayer],
                  error: null,
                });
              }),
            };
          }),
        })),
        auth: {
          signInWithPassword: jest.fn(() => ({
            data: { session: { user: { id: "mockUserId" } } },
            error: null,
          })),
          signOut: jest.fn(() => ({ error: null })),
        },
      };
    },
  };
});

// Mock dbClient and response supabase mock
jest.mock("../../src/dbClient", () => {
  const mockSupabaseClient = require("@supabase/supabase-js").createClient();
  return {
    __esModule: true,
    default: mockSupabaseClient, // response supabase mock
    // initializeDb: jest.fn(),
    // signIn: jest.fn(),
    // signOut: jest.fn(),
  };
});

const app = express();
app.use(express.json());
app.use("/api", playerRoutes);

// Mock playerId
jest.mock("uuid", () => ({
  v4: () => "123e4567-e89b-12d3-a456-426614174000",
}));

describe("Player Controller", () => {
  it("should get all players", async () => {
    const res = await request(app).get("/api/players");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(15);
  });

  it("should read player by playerId", async () => {
    const playerId = "1";
    const res = await request(app).get(`/api/players/${playerId}`);
    expect(res.body.playerId).toEqual(playerId);
    expect(res.body.name).toEqual("Doe");
    expect(res.body.position).toBe(Position.DEFENDER);
  });

  it("should update player data", async () => {
    // const playerId = 2;
    const updates = {
      playerId: "2",
      name: "Miller",
      firstname: "Jane",
      position: "Forward",
    };
    const res = await request(app)
      .put(`/api/players/${updates.playerId}`)
      .send(updates);
    expect(res.body.name).toEqual("Miller");

    const res2 = await request(app).get("/api/players");
    expect(res2.body).toHaveLength(15);
  });

  it("should add a new player", async () => {
    const newPlayer = {
      name: "Johnson",
      firstname: "Alice",
    };

    const res = await request(app).post("/api/players").send(newPlayer);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
      ...newPlayer,
      playerId: "123e4567-e89b-12d3-a456-426614174000",
    });

    const res2 = await request(app).get("/api/players");
    expect(res2.body).toHaveLength(16);
  });
});
