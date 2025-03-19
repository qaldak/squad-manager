import { describe, expect, it, jest } from "@jest/globals";
import express from "express";
import request from "supertest";
import { EngagementStatus } from "../../src/models/PlayerEngagement";
import playerEngagementRoutes from "../../src/routes/playerEngangement.routes";
import PlayerEngagementService from "../../src/services/playerEngagement.service";
import playerEngagementsData from "../__mocks__/mock.playerEngagement";
import schedulesData from "../__mocks__/mock.schedule";
import logger from "../../src/utils/logger";

const app = express();

app.use(express.json());
app.use("/api", playerEngagementRoutes);

jest.mock("@supabase/supabase-js", () => {
  return {
    createClient: () => {
      return {
        from: jest.fn((tableName: string) => {
          if (tableName === "schedules") {
            return {
              select: jest.fn(() => {
                const schedules = schedulesData.getSchedules();
                return Promise.resolve({
                  data: schedules,
                  error: null,
                });
              }),
            };
          } else if (tableName === "player_engagements") {
            return {
              select: jest.fn(() => {
                return {
                  eq: jest.fn((column: string, value: string) => {
                    if (column === "player_id") {
                      const engagementsByPlayer =
                        playerEngagementsData.searchPlayerEngagementsByPlayer(
                          value,
                        );
                      return Promise.resolve({
                        data: engagementsByPlayer ? engagementsByPlayer : [],
                        error: null,
                      });
                    } else if (column === "schedule_id") {
                      const engagementsBySchedule =
                        playerEngagementsData.searchPlayerEngagementBySchedule(
                          value,
                        );
                      return Promise.resolve({
                        data: engagementsBySchedule
                          ? engagementsBySchedule
                          : [],
                        error: null,
                      });
                    }
                  }),
                  then: jest.fn(
                    (
                      callback: (result: { data: any[]; error: null }) => void,
                    ) => {
                      const player_engagements =
                        playerEngagementsData.getPlayerEngagements();
                      return callback({
                        data: player_engagements,
                        error: null,
                      });
                    },
                  ),
                };
              }),
              insert: jest.fn((data) => {
                const newPlayerEngagement =
                  playerEngagementsData.addPlayerEngagement(data);
                return {
                  select: jest.fn(() => {
                    return Promise.resolve({
                      data: [newPlayerEngagement],
                      error: null,
                    });
                  }),
                };
              }),
              update: jest.fn((data) => {
                const updatedPlayerEngagement =
                  playerEngagementsData.updatePlayerEngagement(data);
                return {
                  eq: jest.fn(() => {
                    return {
                      select: jest.fn(() => {
                        return Promise.resolve({
                          data: [updatedPlayerEngagement],
                          error: null,
                        });
                      }),
                    };
                  }),
                };
              }),
              delete: jest.fn(() => {
                return {
                  eq: jest.fn((column: string, value: string) => {
                    logger.debug(column, value);
                    const {
                      data: deletedPlayerEngagement,
                      status,
                      statusText,
                    } = playerEngagementsData.deletePlayerEngagement(value);
                    return {
                      select: jest.fn(() => {
                        return Promise.resolve({
                          data: deletedPlayerEngagement,
                          status: status,
                          statusText: statusText,
                        });
                      }),
                    };
                  }),
                };
              }),
            };
          }
        }),
      };
    },
  };
});

describe("PlayerEngagement Controller", () => {
  it("should get all playerEngagements", async () => {
    const res = await request(app).get("/api/playerEngagements");
    expect(res.body).toHaveLength(21);
    expect(res.statusCode).toEqual(200);
  });

  it("should get all engagements for given playerId", async () => {
    const res = await request(app).get("/api/playerEngagements/player/2");

    expect(res.body).toHaveLength(2);
    expect(res.body).toEqual([
      {
        id: "M081002",
        playerId: "2",
        scheduleId: "M0810",
        status: "definitive",
        manually: false,
      },
      {
        id: "M083102",
        playerId: "2",
        scheduleId: "M0831",
        status: "definitive",
        manually: false,
      },
    ]);
    expect(res.statusCode).toEqual(200);
  });

  it("should get all engagements for given scheduleId", async () => {
    const res = await request(app).get("/api/playerEngagements/schedule/M0810");

    expect(res.body).toHaveLength(3);
    expect(res.body).toEqual([
      {
        id: "M081001",
        manually: false,
        playerId: "1",
        scheduleId: "M0810",
        status: "provisional",
      },
      {
        id: "M081002",
        manually: false,
        playerId: "2",
        scheduleId: "M0810",
        status: "definitive",
      },
      {
        id: "M081005",
        manually: true,
        playerId: "5",
        scheduleId: "M0810",
        status: "definitive",
      },
    ]);
    expect(res.statusCode).toEqual(200);
  });

  it("should update player engagement", async () => {
    const updates = {
      id: "M081002",
      playerId: "2",
      scheduleId: "M0810",
      manually: true,
      status: "provisional",
    };

    const res = await request(app).put(`/api/playerEngagement`).send(updates);

    logger.debug("response: ", res.body);

    expect(res.body.manually).toBeTruthy();
    expect(res.body.status).toEqual("provisional");
  });

  it("should add a new player engagement", async () => {
    const newPlayerEngagement = {
      playerId: "99",
      scheduleId: "M1212",
      status: EngagementStatus.PROVISIONAL,
      manually: true,
    };

    const res = await request(app)
      .post("/api/playerEngagement")
      .send(newPlayerEngagement);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
      ...newPlayerEngagement,
      id: "Foo",
    });

    const resCount = await request(app).get("/api/playerEngagements");
    expect(resCount.body).toHaveLength(22);
  });

  it("should add new player engagements", async () => {
    const newPlayerEngagements = [
      {
        id: "Foo",
        playerId: "88",
        scheduleId: "M1121",
        status: EngagementStatus.PROVISIONAL,
        manually: false,
      },
      {
        id: "Foo",
        playerId: "89",
        scheduleId: "M1121",
        status: EngagementStatus.DEFINITIVE,
        manually: true,
      },
    ];

    const tmpCount = await request(app).get("/api/playerEngagements");

    const res = await request(app)
      .post("/api/playerEngagements/bulk")
      .send(newPlayerEngagements);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(newPlayerEngagements);

    const resCount = await request(app).get("/api/playerEngagements");
    expect(resCount.body).toHaveLength(
      tmpCount.body.length + newPlayerEngagements.length,
    );
  });

  it("should delete entry from player engagement", async () => {
    const playerId = 7;
    const scheduleId = "T0820";
    const id = "T082007";

    const res = await request(app).delete(`/api/playerEngagement/${id}`);
    logger.debug(`Response: ${JSON.stringify(res)}`);
    expect(res.statusCode).toEqual(204);

    const deletedEngagement = await request(app).get(
      `/api/playerEngagement/${playerId}/${scheduleId}`,
    );
    expect(deletedEngagement.body).toEqual({});

    // check message if player engagement does not exist anymore
    const resMsg = await request(app)
      .delete(`/api/playerEngagement/${id}`)
      .expect(404);
    expect(resMsg.body.message).toBe("Player engagement not found");
  });

  it("should count number of match participation", async () => {
    const playerId = "3";

    const matchCount =
      await PlayerEngagementService.determineMatchParticipation(playerId);
    expect(matchCount).toEqual(2);

    const cancellations = await PlayerEngagementService.determineCancellations(
      playerId,
      new Date("2024-08-18"),
    );
    expect(cancellations).toEqual(1);
  });

  it("should confirm all provisional players", async () => {
    const scheduleId = "M0810";

    let provisionalPlayers = 0;
    let definitivePlayers = 0;

    await PlayerEngagementService.setEngagementDefinitive(scheduleId);

    const res = await request(app).get(
      `/api/playerEngagements/schedule/${scheduleId}`,
    );

    const playerEngagements = res.body;
    playerEngagements.forEach((engagement) => {
      switch (engagement.status) {
        case "provisional":
          provisionalPlayers += 1;
          break;
        case "definitive":
          definitivePlayers += 1;
          break;
      }
    });
    expect(provisionalPlayers).toEqual(0);
    expect(definitivePlayers).toEqual(3);
  });
});
