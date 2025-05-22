export interface Player {
  playerId: string
  name: string
  firstname: string
  birthYear?: number
  position?: Position
}

export interface PlayerWithEngagement extends Player {
  totalParticipation: number
  totalCancellation: number
}

export enum Position {
  GOALKEEPER = 'goalkeeper',
  DEFENDER = 'defender',
  MIDFIELDER = 'midfielder',
  FORWARD = 'forward'
}
