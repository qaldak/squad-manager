import request from "supertest";
import express from "express";
import playerRoutes from "../../src/routes/player.routes";
import { Position } from "../../src/models/Player";
import { jest, describe, it, expect } from "@jest/globals"
const app = express();

app.use(express.json());
app.use("/api", playerRoutes);

// Mock player Id
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
    const playerId = 1;
    const res = await request(app).get(`/api/players/${playerId}`);
    expect(res.body.playerId).toEqual(playerId.toString());
    expect(res.body.name).toEqual("Doe");
    expect(res.body.position).toBe(Position.DEFENDER);
  });

  it("should update player data", async () => {
    const playerId = 2;
    const updates = {
      name: "Miller",
      firstname: "Jane",
      position: "Forward",
    };
    const res = await request(app)
      .put(`/api/players/${playerId}`)
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
