import type { ITranslations } from '@/i18n/ITranslations.ts'

export const enTranslations: ITranslations = {
  player: {
    firstname: 'firstname',
    name: 'name',
    position: 'position',
    yearOfBirth: 'year of birth',
    birthday: 'birthday',
    players: 'Players',
    buttons: {
      newPlayer: 'add new player'
    },
    enums: {
      position: {
        defender: 'Defender',
        forward: 'Forward',
        goalkeeper: 'Goalkeeper',
        midfielder: 'Midfielder'
      }
    },
    titles: {
      newPlayer: 'New player',
      editPlayer: 'Edit player'
    }
  },
  schedule: {
    date: 'date',
    location: 'location',
    scheduleType: 'event type',
    matchType: 'match type',
    schedules: 'Schedules',
    buttons: {
      newSchedule: 'add new schedule',
      inclPastFilter: 'incl. past'
    },
    enums: {
      scheduleType: {
        game_day: 'game',
        training: 'training'
      },
      matchType: {
        cup: 'Cup game',
        league: 'Championship',
        indoor: 'Indoor game',
        friendly: 'Friendly game'
      }
    },
    titles: {
      editSchedule: 'Edit schedule',
      newSchedule: 'Add schedule'
    }
  },
  playerEngagement: {
    manuallyAdded: 'manually added',
    status: 'state',
    assignPlayer: 'Assign player',
    totalParticipation: 'Participation',
    totalCancellation: 'Cancellation',
    buttons: {
      assignPlayer: 'assign',
      generateProposal: 'generate squad',
      confirmProposal: 'confirm squad'
    },
    enums: {
      status: {
        CANCELED: 'canceled',
        DEFINITIVE: 'definitive',
        PROVISIONAL: 'provisional'
      }
    },
    messages: {
      deletePlayer: 'Remove player from list',
      playerAlreadyAssigned: 'Player already assigned',
      playerAssigned: 'Player assigned successfully',
      playerDeleted: 'Player successfully deleted',
      searchPlayer: 'Enter name or first name'
    },
    titles: {
      playerEngagement: 'Player engagement'
    }
  },
  common: {
    bool: {
      false: 'Nein',
      true: 'Ja'
    },
    buttons: {
      cancel: 'cancel',
      close: 'close',
      save: 'save',
      saveAndClose: 'save and close'
    },
    messages: {
      fieldRequired: 'field is required',
      noDataAvailable: 'no data available',
      errorReadingData: 'error reading data'
    }
  }
}
