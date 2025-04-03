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
    titles: {
      newPlayer: 'New player',
      editPlayer: 'Edit player'
    }
  },
  schedule: {
    date: 'date',
    location: 'location',
    eventType: 'event type',
    matchType: 'match type',
    schedules: 'Schedules',
    buttons: {
      newSchedule: 'add new schedule',
      inclPastFilter: 'incl. past'
    },
    enums: {
      eventType: {
        game: 'game',
        training: 'training'
      },
      matchType: {
        cup: 'Cup game',
        league: 'League game',
        indoor: 'Indoor game',
        friendly: 'Friendly game'
      }
    }
  },
  playerEngagement: {
    manuallyAdded: 'manually added',
    status: 'state',
    assignPlayer: 'Assign player',
    buttons: {
      assignPlayer: 'assign',
      generateProposal: 'generate squad',
      confirmProposal: 'confirm squad'
    },
    enums: {
      status: {
        canceled: 'canceled',
        definitive: 'definitive',
        provisional: 'provisional'
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
    buttons: {
      cancel: 'cancel',
      save: 'save',
      saveAndClose: 'save and close'
    },
    messages: {
      fieldRequired: 'field is required'
    }
  }
}
