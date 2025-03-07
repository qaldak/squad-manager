import {Position} from "../../src/models/Player";

const mockPlayers = [
  {
    id: "1",
    name: "Doe",
    firstname: "John",
    birthyear: null,
    position: Position.DEFENDER,
  },
  {
    id: "2",
    name: "Smith",
    firstname: "Jane",
    birthyear: null,
    position: Position.FORWARD,
  },
  {
    id: "3",
    name: "Lee",
    firstname: "Mike",
    birthyear: null,
    position: Position.MIDFIELDER,
  },
  {
    id: "4",
    name: "Brown",
    firstname: "Alice",
    birthyear: null,
    position: null,
  },
  {
    id: "5",
    name: "Garcia",
    firstname: "Carlos",
    birthyear: null,
    position: Position.GOALKEEPER,
  },
  {
    id: "6",
    name: "Nguyen",
    firstname: "Linh",
    birthyear: null,
    position: null,
  },
  {
    id: "7",
    name: "Schmidt",
    firstname: "Peter",
    birthyear: null,
    position: Position.DEFENDER,
  },
  {
    id: "8",
    name: "Kim",
    firstname: "Soo-hyun",
    birthyear: null,
    position: null,
  },
  {
    id: "9",
    name: "Popescu",
    firstname: "Ion",
    birthyear: null,
    position: Position.FORWARD,
  },
  {
    id: "10",
    name: "Müller",
    firstname: "Franz",
    birthyear: null,
    position: null,
  },
  {
    id: "11",
    name: "Zhang",
    firstname: "Wei",
    birthyear: null,
    position: null,
  },
  {
    id: "12",
    name: "Santos",
    firstname: "Ricardo",
    birthyear: null,
    position: Position.MIDFIELDER,
  },
  {
    id: "13",
    name: "Johnson",
    firstname: "David",
    birthyear: null,
    position: null,
  },
  {
    id: "14",
    name: "Bertrand",
    firstname: "Olivier",
    birthyear: null,
    position: Position.DEFENDER,
  },
  {
    id: "15",
    name: "Diaz",
    firstname: "Isabella",
    birthyear: null,
    position: null,
  },
];

const getPlayers = () => mockPlayers;

const readPlayer = (playerId: string) => {
  return mockPlayers.find((player) => player.id === playerId);
};

const addPlayer = (player) => {
  player.id = "123e4567-e89b-12d3-a456-426614174000"
  mockPlayers.push(player);
  return mockPlayers[mockPlayers.length - 1];
};

const updatePlayer = (updatedPlayer) => {
  const index = mockPlayers.findIndex(
    (player) => player.id === updatedPlayer.id
  );

  if (index !== -1) {
    mockPlayers[index] = { ...mockPlayers[index], ...updatedPlayer };
    return mockPlayers[index];
  }
};

export default {
  mockPlayers,
  getPlayers,
  readPlayer,
  addPlayer,
  updatePlayer,
};
