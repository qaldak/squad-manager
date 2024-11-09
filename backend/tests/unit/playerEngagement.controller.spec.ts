import { describe, expect, it } from '@jest/globals'
import express from 'express'
import request from 'supertest'
import {
  EngagementStatus,
  PlayerEngagement
} from '../../src/models/PlayerEngagement'
import playerEngagementRoutes from '../../src/routes/playerEngangement.routes'

const app = express()

app.use(express.json())
app.use('/api', playerEngagementRoutes)

describe('PlayerEngagement Controller', () => {
  it('should get all playerEngagements', async () => {
    const res = await request(app).get('/api/playerEngagements')
    expect(res.body).toHaveLength(17)
    expect(res.statusCode).toEqual(200)
  })

  it('should read one playerEngagement', async () => {
    const res = await request(app).get('/api/playerEngagement/2/M0810')
    expect(res.body).toEqual({
      manually: false,
      playerId: '2',
      scheduleId: 'M0810',
      status: 'definitive'
    })
    expect(res.statusCode).toEqual(200)
  })

  it('should get all engagements for given playerId', async () => {
    const res = await request(app).get('/api/playerEngagements/player/2')

    expect(res.body).toHaveLength(2)
    expect(res.body).toEqual([
      {
        playerId: '2',
        scheduleId: 'M0810',
        status: 'definitive',
        manually: false
      },
      {
        playerId: '2',
        scheduleId: 'M0831',
        status: 'definitive',
        manually: false
      }
    ])
    expect(res.statusCode).toEqual(200)
  })

  it('should get all engagements for given scheduleId', async () => {
    const res = await request(app).get('/api/playerEngagements/schedule/M0810')

    expect(res.body).toHaveLength(3)
    expect(res.body).toEqual([
      {
        manually: false,
        playerId: '1',
        scheduleId: 'M0810',
        status: 'provisional'
      },
      {
        manually: false,
        playerId: '2',
        scheduleId: 'M0810',
        status: 'definitive'
      },
      {
        manually: true,
        playerId: '5',
        scheduleId: 'M0810',
        status: 'definitive'
      }
    ])
    expect(res.statusCode).toEqual(200)
  })

  it('should update player engagement', async () => {
    const playerId = 2
    const scheduleId = 'M0810'
    const updates = {
      manually: true,
      status: 'provisional'
    }

    const res = await request(app)
      .put(`/api/playerEngagement/${playerId}/${scheduleId}`)
      .send(updates)

    expect(res.body.manually).toBeTruthy()
    expect(res.body.status).toEqual('provisional')
  })

  it('should add a new player engagement', async () => {
    const newPlayerEngagement = new PlayerEngagement(
      '99',
      'M1212',
      EngagementStatus.PROVISIONAL,
      true
    )

    const res = await request(app)
      .post('/api/playerEngagement')
      .send(newPlayerEngagement)
    expect(res.statusCode).toEqual(201)
    expect(res.body).toEqual(newPlayerEngagement)

    const resCount = await request(app).get('/api/playerEngagements')
    expect(resCount.body).toHaveLength(18)
  })

  it('should add new player engagements', async () => {
    const newPlayerEngagements = [
      {
        playerId: '88',
        scheduleId: 'M1121',
        status: EngagementStatus.PROVISIONAL,
        manually: false
      },
      {
        playerId: '89',
        scheduleId: 'M1121',
        status: EngagementStatus.DEFINITIVE,
        manually: true
      }
    ]

    const tmpCount = await request(app).get('/api/playerEngagements')

    const res = await request(app)
      .post('/api/playerEngagements/bulk')
      .send(newPlayerEngagements)
    expect(res.statusCode).toEqual(201)
    expect(res.body).toEqual(newPlayerEngagements)

    const resCount = await request(app).get('/api/playerEngagements')
    expect(resCount.body).toHaveLength(tmpCount.body.length + newPlayerEngagements.length)
  })

  it('should delete entry from player engagement', async () => {
    const playerId = 7
    const scheduleId = 'M0820'

    const res = await request(app).delete(`/api/playerEngagement/${playerId}/${scheduleId}`)
    expect(res.statusCode).toEqual(200)
    expect(res.body.message).toBe('Player engagement deleted successfully')

    const deletedEngagement = await request(app).get(`/api/playerEngagement/${playerId}/${scheduleId}`)
    expect(deletedEngagement.body).toEqual('')

    // check message if player engagement does not exist anymore
    const resMsg = await request(app)
      .delete(`/api/playerEngagement/${playerId}/${scheduleId}`)
      .expect(404)
    expect(resMsg.body.message).toBe('Player engagement not found')
  })
})
