import { EngagementStatus } from "../../src/models/PlayerEngagement";

const playerEngagements = [
  {
    playerId: "1",
    scheduleId: "M0810",
    status: EngagementStatus.PROVISIONAL,
    manually: false,
  },
  {
    playerId: "2",
    scheduleId: "M0810",
    status: EngagementStatus.DEFINITIVE,
    manually: false,
  },
  {
    playerId: "3",
    scheduleId: "T0813",
    status: EngagementStatus.CANCELED,
    manually: true,
  },
  {
    playerId: "4",
    scheduleId: "T0813",
    status: EngagementStatus.PROVISIONAL,
    manually: false,
  },
  {
    playerId: "5",
    scheduleId: "M0810",
    status: EngagementStatus.DEFINITIVE,
    manually: true,
  },
  {
    playerId: "6",
    scheduleId: "T0815",
    status: EngagementStatus.PROVISIONAL,
    manually: false,
  },
  {
    playerId: "7",
    scheduleId: "T0820",
    status: EngagementStatus.DEFINITIVE,
    manually: true,
  },
  {
    playerId: "8",
    scheduleId: "T0822",
    status: EngagementStatus.PROVISIONAL,
    manually: false,
  },
  {
    playerId: "9",
    scheduleId: "M0824",
    status: EngagementStatus.CANCELED,
    manually: true,
  },
  {
    playerId: "10",
    scheduleId: "T0829",
    status: EngagementStatus.DEFINITIVE,
    manually: false,
  },
  {
    playerId: "11",
    scheduleId: "T0813",
    status: EngagementStatus.PROVISIONAL,
    manually: false,
  },
  {
    playerId: "12",
    scheduleId: "T0815",
    status: EngagementStatus.DEFINITIVE,
    manually: false,
  },
  {
    playerId: "13",
    scheduleId: "M0817",
    status: EngagementStatus.PROVISIONAL,
    manually: false,
  },
  {
    playerId: "14",
    scheduleId: "T0820",
    status: EngagementStatus.DEFINITIVE,
    manually: true,
  },
  {
    playerId: "15",
    scheduleId: "M0827",
    status: EngagementStatus.CANCELED,
    manually: true,
  },
  {
    playerId: "1",
    scheduleId: "M0831",
    status: EngagementStatus.PROVISIONAL,
    manually: true,
  },
  {
    playerId: "2",
    scheduleId: "M0831",
    status: EngagementStatus.DEFINITIVE,
    manually: false,
  },
  {
    playerId: "14",
    scheduleId: "M0824",
    status: EngagementStatus.DEFINITIVE,
    manually: true,
  },
];

const getPlayerEngagements = () => playerEngagements;

const readPlayerEngagement = (playerId: string, scheduleId: string) => {
  return playerEngagements.find(
    (engagement) =>
      engagement.playerId === playerId && engagement.scheduleId === scheduleId
  );
};

const findPlayerEngagementBySchedule = (scheduleId: string) => {
  return playerEngagements.filter(
    (engagement) => engagement.scheduleId === scheduleId
  );
};

const findPlayerEngagementsByPlayer = (playerId: string) => {
  return playerEngagements.filter(
    (engagement) => engagement.playerId === playerId
  );
};

const addPlayerEngagement = (engagement) => playerEngagements.push(engagement);

const updatePlayerEngagement = (updatedPlayerEngagement) => {
  const index = playerEngagements.findIndex(
    (engagement) =>
      engagement.playerId === updatedPlayerEngagement.playerId &&
      engagement.scheduleId === updatedPlayerEngagement.scheduleId
  );
  if (index !== -1) {
    playerEngagements[index] = {
      ...playerEngagements[index],
      ...updatedPlayerEngagement,
    };
    return playerEngagements[index];
  }
};

const deletePlayerEngagement = (playerId: string, scheduleId: string) => {
  const index = playerEngagements.findIndex(
    (engagement) =>
      engagement.playerId === playerId && engagement.scheduleId === scheduleId
  );
  if (index !== -1) {
    playerEngagements.splice(index, 1);
  }
};

export default {
  playerEngagements,
  getPlayerEngagements,
  readPlayerEngagement,
  findPlayerEngagementsByPlayer,
  findPlayerEngagementBySchedule,
  addPlayerEngagement,
  updatePlayerEngagement,
  deletePlayerEngagement,
};
