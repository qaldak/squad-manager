import { EngagementStatus } from "../../src/models/PlayerEngagement";
import logger from "../../src/utils/logger";

const mockPlayerEngagements = [
  {
    id: "M081001",
    player_id: "1",
    schedule_id: "M0810",
    participation_status: EngagementStatus.PROVISIONAL,
    manually_added: false,
  },
  {
    id: "M081002",
    player_id: "2",
    schedule_id: "M0810",
    participation_status: EngagementStatus.DEFINITIVE,
    manually_added: false,
  },
  {
    id: "T081303",
    player_id: "3",
    schedule_id: "T0813",
    participation_status: EngagementStatus.CANCELED,
    manually_added: true,
  },
  {
    id: "T081304",
    player_id: "4",
    schedule_id: "T0813",
    participation_status: EngagementStatus.PROVISIONAL,
    manually_added: false,
  },
  {
    id: "M081005",
    player_id: "5",
    schedule_id: "M0810",
    participation_status: EngagementStatus.DEFINITIVE,
    manually_added: true,
  },
  {
    id: "T081506",
    player_id: "6",
    schedule_id: "T0815",
    participation_status: EngagementStatus.PROVISIONAL,
    manually_added: false,
  },
  {
    id: "T082007",
    player_id: "7",
    schedule_id: "T0820",
    participation_status: EngagementStatus.DEFINITIVE,
    manually_added: true,
  },
  {
    id: "T082208",
    player_id: "8",
    schedule_id: "T0822",
    participation_status: EngagementStatus.PROVISIONAL,
    manually_added: false,
  },
  {
    id: "M082409",
    player_id: "9",
    schedule_id: "M0824",
    participation_status: EngagementStatus.CANCELED,
    manually_added: true,
  },
  {
    id: "T082910",
    player_id: "10",
    schedule_id: "T0829",
    participation_status: EngagementStatus.DEFINITIVE,
    manually_added: false,
  },
  {
    id: "T081311",
    player_id: "11",
    schedule_id: "T0813",
    participation_status: EngagementStatus.PROVISIONAL,
    manually_added: false,
  },
  {
    id: "T081512",
    player_id: "12",
    schedule_id: "T0815",
    participation_status: EngagementStatus.DEFINITIVE,
    manually_added: false,
  },
  {
    id: "M081713",
    player_id: "13",
    schedule_id: "M0817",
    participation_status: EngagementStatus.PROVISIONAL,
    manually_added: false,
  },
  {
    id: "T082014",
    player_id: "14",
    schedule_id: "T0820",
    participation_status: EngagementStatus.DEFINITIVE,
    manually_added: true,
  },
  {
    id: "M082715",
    player_id: "15",
    schedule_id: "M0827",
    participation_status: EngagementStatus.CANCELED,
    manually_added: true,
  },
  {
    id: "M083101",
    player_id: "1",
    schedule_id: "M0831",
    participation_status: EngagementStatus.PROVISIONAL,
    manually_added: true,
  },
  {
    id: "M083102",
    player_id: "2",
    schedule_id: "M0831",
    participation_status: EngagementStatus.DEFINITIVE,
    manually_added: false,
  },
  {
    id: "M082414",
    player_id: "14",
    schedule_id: "M0824",
    participation_status: EngagementStatus.DEFINITIVE,
    manually_added: true,
  },
  {
    id: "M081703",
    player_id: "3",
    schedule_id: "M0817",
    participation_status: EngagementStatus.DEFINITIVE,
    manually_added: true,
  },
  {
    id: "M082403",
    player_id: "3",
    schedule_id: "M0824",
    participation_status: EngagementStatus.CANCELED,
    manually_added: true,
  },
  {
    id: "M083103",
    player_id: "3",
    schedule_id: "M0831",
    participation_status: EngagementStatus.DEFINITIVE,
    manually_added: false,
  },
];

const getPlayerEngagements = () => mockPlayerEngagements;

const readPlayerEngagement = (id: string) => {
  return mockPlayerEngagements.find((engagement) => engagement.id === id);
};

const searchPlayerEngagementBySchedule = (scheduleId: string) => {
  return mockPlayerEngagements.filter(
    (engagement) => engagement.schedule_id === scheduleId,
  );
};

const searchPlayerEngagementsByPlayer = (playerId: string) => {
  return mockPlayerEngagements.filter(
    (engagement) => engagement.player_id === playerId,
  );
};

const addPlayerEngagement = (engagement) => {
  engagement.id = "Foo";
  mockPlayerEngagements.push(engagement);
  return mockPlayerEngagements[mockPlayerEngagements.length - 1];
};

const updatePlayerEngagement = (updatedPlayerEngagement) => {
  const index = mockPlayerEngagements.findIndex(
    (engagement) => engagement.id === updatedPlayerEngagement.id,
  );

  if (index !== -1) {
    mockPlayerEngagements[index] = {
      ...mockPlayerEngagements[index],
      ...updatedPlayerEngagement,
    };
    return mockPlayerEngagements[index];
  }
};

const deletePlayerEngagement = (id: string) => {
  const index = mockPlayerEngagements.findIndex(
    (engagement) => engagement.id === id,
  );

  const deletedEngagement = readPlayerEngagement(id);
  logger.debug(`deletedEngagement ${deletedEngagement}`);
  if (index !== -1) {
    mockPlayerEngagements.splice(index, 1);
    return { data: [deletedEngagement], status: 200, statusText: `OK` };
  } else {
    return {
      status: 404,
      statusText: `Error deleting player engagement, id: ${id}`,
    };
  }
};

export default {
  mockPlayerEngagements,
  getPlayerEngagements,
  searchPlayerEngagementsByPlayer,
  searchPlayerEngagementBySchedule,
  addPlayerEngagement,
  updatePlayerEngagement,
  deletePlayerEngagement,
};
