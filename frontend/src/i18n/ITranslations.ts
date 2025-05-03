export type ITranslations = {
  player: {
    firstname: string
    name: string
    position: string
    yearOfBirth: string
    birthday: string
    players: string
    buttons: {
      newPlayer: string
    }
    enums: {
      position: {
        defender: string
        forward: string
        goalkeeper: string
        midfielder: string
      }
    }
    titles: {
      newPlayer: string
      editPlayer: string
    }
  }
  schedule: {
    date: string
    location: string
    scheduleType: string
    matchType: string
    schedules: string
    buttons: {
      newSchedule: string
      inclPastFilter: string
    }
    enums: {
      scheduleType: {
        game_day: string
        training: string
      }
      matchType: {
        cup: string
        league: string
        indoor: string
        friendly: string
      }
    }
    titles: {
      editSchedule: string
      newSchedule: string
    }
  }
  playerEngagement: {
    manuallyAdded: string
    status: string
    assignPlayer: string
    totalParticipation: string
    totalCancellation: string
    buttons: {
      assignPlayer: string
      generateProposal: string
      confirmProposal: string
    }
    enums: {
      status: {
        CANCELED: string
        DEFINITIVE: string
        PROVISIONAL: string
      }
    }
    messages: {
      deletePlayer: string
      playerAlreadyAssigned: string
      playerAssigned: string
      playerDeleted: string
      searchPlayer: string
    }
    titles: {
      playerEngagement: string
    }
  }
  common: {
    bool: {
      false: string
      true: string
    }
    buttons: {
      cancel: string
      close: string
      save: string
      saveAndClose: string
    }
    messages: {
      fieldRequired: string
      noDataAvailable: string
      errorReadingData: string
    }
  }
}
