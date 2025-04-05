export interface Player {
  playerId: string
  name: string
  firstname: string
  birthYear?: number
  position?: Position
}

export enum Position {
  GOALKEEPER = 'goalkeeper',
  DEFENDER = 'defender',
  MIDFIELDER = 'midfielder',
  FORWARD = 'forward'
}
