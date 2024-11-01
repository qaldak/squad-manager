export class Player {
  playerId: string;
  name: string;
  firstname: string;
  birthYear?: number;
  position?: Position;

  constructor(playerId, name, firstname, birthYear?, position?) {
    this.playerId = playerId;
    this.name = name;
    this.firstname = firstname;
    this.birthYear = birthYear;
    this.position = position;
  }
}

export enum Position {
  GOALKEEPER = "Goalkeeper",
  DEFENDER = "Defender",
  MIDFIELDER = "Midfielder",
  FORWARD = "Forward",
}
