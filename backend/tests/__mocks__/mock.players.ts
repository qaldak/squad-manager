import { Position } from "../../src/models/Player";

const players = [
  {
    playerId: "1",
    name: "Doe",
    firstname: "John",
    birthYear: null,
    position: Position.DEFENDER,
  },
  {
    playerId: "2",
    name: "Smith",
    firstname: "Jane",
    birthYear: null,
    position: Position.FORWARD,
  },
  {
    playerId: "3",
    name: "Lee",
    firstname: "Mike",
    birthYear: null,
    position: Position.MIDFIELDER,
  },
  {
    playerId: "4",
    name: "Brown",
    firstname: "Alice",
    birthYear: null,
  },
  {
    playerId: "5",
    name: "Garcia",
    firstname: "Carlos",
    birthYear: null,
    position: Position.GOALKEEPER,
  },
  {
    playerId: "6",
    name: "Nguyen",
    firstname: "Linh",
    birthYear: null,
  },
  {
    playerId: "7",
    name: "Schmidt",
    firstname: "Peter",
    birthYear: null,
    position: Position.DEFENDER,
  },
  {
    playerId: "8",
    name: "Kim",
    firstname: "Soo-hyun",
    birthYear: null,
  },
  {
    playerId: "9",
    name: "Popescu",
    firstname: "Ion",
    birthYear: null,
    position: Position.FORWARD,
  },
  {
    playerId: "10",
    name: "Müller",
    firstname: "Franz",
    birthYear: null,
  },
  {
    playerId: "11",
    name: "Zhang",
    firstname: "Wei",
    birthYear: null,
  },
  {
    playerId: "12",
    name: "Santos",
    firstname: "Ricardo",
    birthYear: null,
    position: Position.MIDFIELDER,
  },
  {
    playerId: "13",
    name: "Johnson",
    firstname: "David",
    birthYear: null,
  },
  {
    playerId: "14",
    name: "Bertrand",
    firstname: "Olivier",
    birthYear: null,
    position: Position.DEFENDER,
  },
  {
    playerId: "15",
    name: "Diaz",
    firstname: "Isabella",
    birthYear: null,
  },
];

const getPlayers = () => players;

const readPlayer = (playerId) => {
  return players.find((player) => player.playerId === playerId);
};

const addPlayer = (player) => {
  players.push(player);
};

const updatePlayer = (updatedPlayer) => {
  const index = players.findIndex(
    (player) => player.playerId === updatedPlayer.playerId
  );
  if (index !== -1) {
    players[index] = { ...players[index], ...updatedPlayer };
    return players[index];
  }
};

export default {
  players,
  getPlayers,
  readPlayer,
  addPlayer,
  updatePlayer,
};
