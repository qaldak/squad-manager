export interface Player {
  playerId: string
  name: string
  firstname: string
  birthYear?: number
  position?: Position
}

export enum Position {
  GOALKEEPER = 'Goalkeeper',
  DEFENDER = 'Defender',
  MIDFIELDER = 'Midfielder',
  FORWARD = 'Forward'
}
