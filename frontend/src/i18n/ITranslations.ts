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
    titles: {
      newPlayer: string
      editPlayer: string
    }
  }
  schedule: {
    date: string
    location: string
    eventType: string
    matchType: string
    schedules: string
    buttons: {
      newSchedule: string
      inclPastFilter: string
    }
    enums: {
      eventType: {
        game: string
        training: string
      }
      matchType: {
        cup: string
        league: string
        indoor: string
        friendly: string
      }
    }
  }
  playerEngagement: {
    manuallyAdded: string
    status: string
    assignPlayer: string
    buttons: {
      assignPlayer: string
      generateProposal: string
      confirmProposal: string
    }
    enums: {
      status: {
        canceled: string
        definitive: string
        provisional: string
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
    buttons: {
      cancel: string
      save: string
      saveAndClose: string
    }
    messages: {
      fieldRequired: string
    }
  }
}
