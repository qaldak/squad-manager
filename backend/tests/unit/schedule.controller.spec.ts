import express from "express";
import request from "supertest";
import scheduleRoutes from "../../src/routes/schedule.routes";
import schedulesData from '../../tests/__mocks__/mock.schedule'
import {MatchType, ScheduleType} from "../../src/models/Schedule";
import {jest, describe, it, expect} from "@jest/globals"
import playersData from "../__mocks__/mock.players";

const app = express();

app.use(express.json());
app.use("/api", scheduleRoutes);

// // Mock schedule Id
// jest.mock("uuid", () => ({
//   v4: () => "987z4321-e89b-12d3-a456-426614174000",
// }));

// Mock db
jest.mock('@supabase/supabase-js', () => {
  return {
    createClient: () => {
      return ({
          from: jest.fn(() => ({
            select: jest.fn(() => {
              return {
                eq: jest.fn((column, value: any) => {
                  console.log(column);
                  if (column === 'id') {
                    const schedule = schedulesData.readSchedule(value)
                    return Promise.resolve({
                      data: schedule ? [schedule] : [],
                      error: null
                    })
                  }
                  if (column === 'date') {
                    const schedule = schedulesData.readScheduleByDate(value)
                    return Promise.resolve({
                      data: schedule ? [schedule] : [],
                      error: null
                    })
                  }
                }),
                then: jest.fn((callback: (result: { data: any[]; error: null }) => void) => {
                  const schedules = schedulesData.getSchedules();
                  return callback({
                    data: schedules,
                    error: null
                  })
                })
              }
            }),
            update: jest.fn((data) => {
              const updatedSchedule = schedulesData.updateSchedule(data)
              return {
                eq: jest.fn(() => {
                  return {
                    select: jest.fn(() => {
                      return Promise.resolve({
                        data: [updatedSchedule],
                        error: null
                      })
                    })
                  }
                })
              }
            }),
            insert: jest.fn((data) => {
              const newSchedule = schedulesData.addSchedule(data)
              return {
                select: jest.fn(() => {
                  return Promise.resolve({
                    data: [newSchedule],
                    error: null
                  })
                })
              }

            })
          }))
        }
      );
    }
  }
})


describe("Schedule Controller", () => {
  it("should get all schedules", async () => {
    const res = await request(app).get("/api/schedules");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(12);
  });

  it("should read a schedule by id", async () => {
    const scheduleId = "M0824";
    const res = await request(app).get(`/api/schedules/id/${scheduleId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.scheduleId).toEqual(scheduleId);
    expect(res.body.date).toEqual("2024-08-24T00:00:00.000Z");
  });

  it("should read a schedule by date", async () => {
    const date = new Date("2024-08-10");
    const res = await request(app).get(`/api/schedules/date/${date}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      scheduleId: "M0810",
      date: "2024-08-10T00:00:00.000Z",
      type: ScheduleType.MATCH_DAY,
      matchType: MatchType.LEAGUE_GAME,
    });
  });

  it("should add a new match day", async () => {
    const newSchedule = {
      date: new Date("2025-09-03"),
      type: ScheduleType.MATCH_DAY,
      matchType: MatchType.LEAGUE_GAME,
    };

    const res = await request(app).post("/api/schedules").send(newSchedule);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
      scheduleId: "987z4321-e89b-12d3-a456-426614174000",
      date: "2025-09-03T00:00:00.000Z",
      type: ScheduleType.MATCH_DAY,
      matchType: MatchType.LEAGUE_GAME,
    });

    const resTotal = await request(app).get("/api/schedules");
    expect(resTotal.body).toHaveLength(13);
  });

  it("should update a schedule entry", async () => {
    const scheduleId = "M0817";
    const updates = {
      date: new Date("2024-08-18"),
      matchType: MatchType.FRIENDLY_GAME,
    };
    const res = await request(app)
      .put(`/api/schedules/${scheduleId}`)
      .send(updates);
    expect(res.body.date).toEqual("2024-08-18T00:00:00.000Z");
    expect(res.body.matchType).toEqual(MatchType.FRIENDLY_GAME);
  });
});
